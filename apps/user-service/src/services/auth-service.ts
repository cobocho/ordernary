import { DrizzleD1Database } from 'drizzle-orm/d1';
import { OAuthProvider } from '../providers/oauth-provider';
import { ProviderType, User, UserInsert, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { GoogleProvider } from '../providers/google-provider';
import { JwtService } from '@ordernary/jwt-service';
import { StateService } from '../services/state-service';
import { generateUlid } from '@ordernary/server-utils';

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
	) {
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
	async loginOrSignup(provider: ProviderType, code: string) {
		const oAuthProvider = this.getProvider(provider);
		const userInfo = await oAuthProvider.getUserInfoByCode(code);

		const { isExist, user } = await this.checkIsExistUser(userInfo.id);

		if (!isExist) {
			return this.handleNewUser(provider, {
				providerId: userInfo.id,
				name: userInfo.name,
				email: userInfo.email,
				phone: userInfo.phone,
				avatarUrl: userInfo.avatarUrl,
				provider: provider,
				state: 'active',
			});
		}

		return this.handleExistingUser(provider, {
			userId: user.userId,
			providerId: user.providerId,
			email: user.email,
			name: user.name,
		});
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
		userInfo: Omit<UserInsert, 'userId'>,
	) {
		const userId = generateUlid();

		const tokenPayload = {
			userId,
			provider,
			providerId: userInfo.providerId,
			email: userInfo.email,
			phone: userInfo.phone,
			avatarUrl: userInfo.avatarUrl,
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
				...userInfo,
				refreshToken,
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
		user: {
			userId: string;
			providerId: string;
			email: string;
			name: string;
		},
	) {
		const tokenPayload = {
			userId: user.userId,
			provider,
			providerId: user.providerId,
			email: user.email,
			name: user.name,
		};

		const refreshToken = this.jwtService.generateRefreshToken(tokenPayload);

		await this.db
			.update(users)
			.set({
				refreshToken,
				updatedAt: Date.now(),
			})
			.where(eq(users.userId, user.userId));

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
	async checkIsExistUser(providerId: string) {
		const result = await this.db
			.select()
			.from(users)
			.where(eq(users.providerId, providerId))
			.limit(1);

		if (result.length > 0) {
			return {
				isExist: true as const,
				user: result[0],
			};
		}

		return {
			isExist: false as const,
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
