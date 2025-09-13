import { SignJWT, jwtVerify } from 'jose';

export interface LoginState {
	client: 'console' | 'app';
	origin: string; // 서버가 결정한 안전한 도메인
	returnTo: string; // 반드시 "/"로 시작하는 내부 경로
}

export class StateService {
	constructor(
		private secret: string,
		private issuer: string,
	) {}

	private getKey() {
		return new TextEncoder().encode(this.secret);
	}

	async sign(payload: LoginState, expiresIn: string = '5m') {
		return new SignJWT(payload as any)
			.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
			.setIssuedAt()
			.setExpirationTime(expiresIn)
			.setJti(crypto.randomUUID()) // nonce
			.setIssuer(this.issuer)
			.sign(this.getKey());
	}

	async verify(token: string): Promise<LoginState | null> {
		try {
			const { payload } = await jwtVerify(token, this.getKey(), {
				issuer: this.issuer,
			});
			const p = payload as unknown as LoginState;
			if (
				p &&
				typeof p.origin === 'string' &&
				typeof p.returnTo === 'string' &&
				(p.client === 'console' || p.client === 'app')
			) {
				return p as LoginState;
			}
			return null;
		} catch {
			return null;
		}
	}
}
