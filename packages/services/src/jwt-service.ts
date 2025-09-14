import jwt, { SignOptions } from 'jsonwebtoken';
import ms from 'ms';

export interface JwtPayload {
	userId: string;
	provider: string;
	providerId: string;
	email: string;
	name: string;
	type?: 'access' | 'refresh';
}

export class JwtService {
	static readonly accessTokenCookieName = 'access_token';
	static readonly refreshTokenCookieName = 'refresh_token';

	constructor(
		private readonly secret: string,
		private readonly issuer: string,
		private readonly accessTokenExpiresIn: ms.StringValue,
		private readonly refreshTokenExpiresIn: ms.StringValue,
	) {}

	generateAccessToken(payload: Omit<JwtPayload, 'type'>): string {
		const options: SignOptions = {
			expiresIn: this.accessTokenExpiresIn, // Access Token은 15분
			issuer: this.issuer,
		};

		return jwt.sign({ ...payload, type: 'access' }, this.secret, options);
	}

	generateRefreshToken(payload: Omit<JwtPayload, 'type'>): string {
		const options: SignOptions = {
			expiresIn: this.refreshTokenExpiresIn, // Refresh Token은 7일
			issuer: this.issuer,
		};

		return jwt.sign({ ...payload, type: 'refresh' }, this.secret, options);
	}

	// 기존 메서드도 유지 (하위 호환성을 위해)
	generateToken(payload: JwtPayload): string {
		const options: SignOptions = {
			expiresIn: '7d',
			issuer: this.issuer,
		};

		return jwt.sign(payload, this.secret, options);
	}

	verifyToken(
		token: string,
		expectedType?: 'access' | 'refresh',
	): JwtPayload | null {
		try {
			const decoded = jwt.verify(token, this.secret, {
				issuer: this.issuer,
			}) as JwtPayload;

			// 토큰 타입 검증 (타입이 지정된 경우)
			if (expectedType && decoded.type !== expectedType) {
				return null;
			}

			return decoded;
		} catch (error) {
			return null;
		}
	}

	refreshToken(
		refreshToken: string,
	): { accessToken: string; refreshToken?: string } | null {
		const payload = this.verifyToken(refreshToken, 'refresh');
		if (!payload) return null;

		const { iat, exp, type, ...userPayload } = payload as any;

		// 새 Access Token 생성
		const accessToken = this.generateAccessToken(userPayload);

		// Refresh Token이 곧 만료되면 새로 발급 (Refresh Token Rotation)
		const shouldRotateRefresh = this.shouldRotateRefreshToken(payload as any);
		const newRefreshToken = shouldRotateRefresh
			? this.generateRefreshToken(userPayload)
			: undefined;

		return {
			accessToken,
			...(newRefreshToken && { refreshToken: newRefreshToken }),
		};
	}

	private shouldRotateRefreshToken(payload: any): boolean {
		const now = Math.floor(Date.now() / 1000);
		const timeUntilExpiry = payload.exp - now;
		const totalLifetime = payload.exp - payload.iat;

		// 토큰 수명의 50% 이상 지났으면 새로 발급
		return timeUntilExpiry < totalLifetime * 0.5;
	}

	// 토큰 만료 확인 유틸리티 메서드
	isTokenExpired(token: string): boolean {
		const payload = this.verifyToken(token);
		return !payload;
	}

	// 토큰에서 사용자 정보 추출
	getUserFromToken(token: string): Omit<JwtPayload, 'type'> | null {
		const payload = this.verifyToken(token);
		if (!payload) return null;

		const { type, iat, exp, ...userInfo } = payload as any;
		return userInfo;
	}
}
