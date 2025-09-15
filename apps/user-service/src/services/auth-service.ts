import { DrizzleD1Database } from 'drizzle-orm/d1';
import { OAuthProvider } from '../providers/oauth-provider';
import { ProviderType, User, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { GoogleProvider } from '../providers/google-provider';
import { JwtService } from '@ordernary/jwt-service';
import { StateService } from '../services/state-service';

export interface AuthResponse {
	user: User;
	refreshToken: string;
	accessToken: string;
}

export interface TokenRefreshResponse {
	accessToken: string;
	refreshToken?: string;
}

export class AuthService {
	constructor(
		private readonly google: GoogleProvider,
		private readonly db: DrizzleD1Database,
		private readonly jwtService: JwtService,
		private readonly stateService: StateService, // 주입
		private readonly allowOrigins: string[], // allowlist
	) {}

	/**
	 * OAuth 인증 URL 생성
	 */
	async getAuthUrl(
		provider: ProviderType,
		client: 'console' | 'app',
		returnTo: string,
		origins: { console: string; app: string },
	): Promise<string> {
		const oAuthProvider = this.getProvider(provider);

		const origin = client === 'console' ? origins.console : origins.app;
		if (!this.isAllowedOrigin(origin)) throw new Error('Invalid origin config');

		const state = await this.stateService.sign({
			client,
			origin,
			returnTo: this.sanitizeReturnTo(returnTo),
		});

		return oAuthProvider.getAuthUrl(state);
	}

	private isAllowedOrigin(origin: string) {
		try {
			const o = new URL(origin).origin;
			return this.allowOrigins.includes(o);
		} catch {
			return false;
		}
	}

	async handleCallback(
		provider: ProviderType,
		code: string,
		stateToken: string,
	): Promise<{ auth: AuthResponse; redirectTo: string }> {
		console.log('handleCallback', provider, code, stateToken);
		const parsed = await this.stateService.verify(stateToken);

		if (!parsed) throw new Error('Invalid state');

		const { origin, returnTo } = parsed;

		if (!this.isAllowedOrigin(origin)) {
			throw new Error('Origin not allowed');
		}

		const auth = await this.loginOrSignup(provider, code);
		const safePath = this.sanitizeReturnTo(returnTo);
		const redirectTo = new URL(safePath, origin).toString();

		return { auth, redirectTo };
	}

	/**
	 * OAuth 코드로 로그인/회원가입 처리
	 */
	async loginOrSignup(
		provider: ProviderType,
		code: string,
	): Promise<AuthResponse> {
		const oAuthProvider = this.getProvider(provider);
		const userInfo = await oAuthProvider.getUserInfoByCode(code);

		const { isExist, user } = await this.checkIsExistUser(userInfo.id);

		if (!isExist) {
			return this.handleNewUser(provider, userInfo);
		}

		return this.handleExistingUser(provider, user);
	}

	// 안전한 경로만 허용
	private sanitizeReturnTo(path: string) {
		return typeof path === 'string' && path.startsWith('/') ? path : '/';
	}

	/**
	 * 신규 사용자 처리
	 */
	private async handleNewUser(
		provider: ProviderType,
		userInfo: { id: string; name: string; email: string; avatarUrl: string },
	): Promise<AuthResponse> {
		const userId = crypto.randomUUID();

		const tokenPayload = {
			userId,
			provider,
			providerId: userInfo.id,
			email: userInfo.email,
			name: userInfo.name,
		};

		// 토큰 생성
		const refreshToken = this.jwtService.generateRefreshToken(tokenPayload);
		const accessToken = this.jwtService.generateAccessToken(tokenPayload);

		// DB에 사용자 저장
		const [newUser] = await this.db
			.insert(users)
			.values({
				userId,
				provider,
				providerId: userInfo.id,
				name: userInfo.name,
				state: 'active',
				email: userInfo.email,
				avatarUrl: userInfo.avatarUrl,
				refreshToken,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			})
			.returning();

		return {
			user: newUser,
			refreshToken,
			accessToken,
		};
	}

	/**
	 * 기존 사용자 처리
	 */
	private async handleExistingUser(
		provider: ProviderType,
		user: any,
	): Promise<AuthResponse> {
		const tokenPayload = {
			userId: user.userId,
			provider,
			providerId: user.providerId,
			email: user.email,
			name: user.name,
		};

		let refreshToken = user.refreshToken;

		if (
			!refreshToken ||
			!this.jwtService.verifyToken(refreshToken, 'refresh')
		) {
			refreshToken = this.jwtService.generateRefreshToken(tokenPayload);

			await this.db
				.update(users)
				.set({
					refreshToken,
					updatedAt: Date.now(),
				})
				.where(eq(users.userId, user.userId));
		}

		const accessToken = this.jwtService.generateAccessToken(tokenPayload);

		return {
			user,
			refreshToken,
			accessToken,
		};
	}

	/**
	 * 사용자 존재 여부 확인
	 */
	async checkIsExistUser(
		providerId: string,
	): Promise<{ isExist: boolean; user: any | null }> {
		const result = await this.db
			.select()
			.from(users)
			.where(eq(users.providerId, providerId))
			.limit(1);

		if (result.length > 0) {
			return {
				isExist: true,
				user: result[0],
			};
		}

		return {
			isExist: false,
			user: null,
		};
	}

	/**
	 * Access Token 갱신
	 */
	async refreshAccessToken(
		refreshToken: string,
	): Promise<TokenRefreshResponse> {
		const tokenResult = this.jwtService.refreshToken(refreshToken);

		if (!tokenResult) {
			throw new Error('Invalid or expired refresh token');
		}

		// 새로운 refresh token이 발급된 경우 DB 업데이트
		if (tokenResult.refreshToken) {
			const payload = this.jwtService.verifyToken(
				tokenResult.accessToken,
				'access',
			);
			if (payload) {
				await this.db
					.update(users)
					.set({
						refreshToken: tokenResult.refreshToken,
						updatedAt: Date.now(),
					})
					.where(eq(users.userId, payload.userId));
			}
		}

		return tokenResult;
	}

	/**
	 * 로그아웃 (refresh token 무효화)
	 */
	async logout(userId: string): Promise<void> {
		await this.db
			.update(users)
			.set({
				refreshToken: null,
				updatedAt: Date.now(),
			})
			.where(eq(users.userId, userId));
	}

	/**
	 * 사용자 회원탈퇴
	 */
	async withdraw(userId: string): Promise<void> {
		await this.db
			.update(users)
			.set({
				state: 'withdrawn',
				refreshToken: null,
				withdrawAt: Date.now(),
				updatedAt: Date.now(),
			})
			.where(eq(users.userId, userId));
	}

	/**
	 * Access Token으로 사용자 정보 조회
	 */
	async getCurrentUser(accessToken: string): Promise<any> {
		const payload = this.jwtService.verifyToken(accessToken, 'access');
		if (!payload) {
			throw new Error('Invalid access token');
		}

		const result = await this.db
			.select()
			.from(users)
			.where(eq(users.userId, payload.userId))
			.limit(1);

		if (result.length === 0) {
			throw new Error('User not found');
		}

		return result[0];
	}

	async logoutAllDevices(userId: string): Promise<void> {
		await this.db
			.update(users)
			.set({
				refreshToken: null,
				updatedAt: Date.now(),
			})
			.where(eq(users.userId, userId));
	}

	/**
	 * OAuth Provider 가져오기
	 */
	private getProvider(provider: ProviderType): OAuthProvider {
		switch (provider) {
			case 'google':
				return this.google;
			default:
				throw new Error(`Unsupported provider: ${provider}`);
		}
	}
}
