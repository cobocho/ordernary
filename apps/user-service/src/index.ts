import { WorkerEntrypoint } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { google } from 'googleapis';
import { ProviderType } from './db/schema';
import { AuthService } from './services/auth-service';
import { GoogleProvider } from './providers/google-provider';
import { JwtService } from './services/jwt-service';
import ms from 'ms';

interface Env {
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REDIRECT_URI: string;
	JWT_SECRET: string;
	JWT_ISSUER: string;
	JWT_ACCESS_TOKEN_EXPIRES_IN: string;
	JWT_REFRESH_TOKEN_EXPIRES_IN: string;
	USER_DB: D1Database;
}

class UserServiceWorker extends WorkerEntrypoint<Env> {
	private authService: AuthService;
	private jwtService: JwtService;
	private db = drizzle(this.env.USER_DB);

	constructor(ctx: ExecutionContext, env: Env) {
		super(ctx, env);

		this.jwtService = new JwtService(
			this.env.JWT_SECRET,
			this.env.JWT_ISSUER,
			this.env.JWT_ACCESS_TOKEN_EXPIRES_IN as ms.StringValue,
			this.env.JWT_REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
		);

		const googleClient = new GoogleProvider(
			this.env.GOOGLE_CLIENT_ID,
			this.env.GOOGLE_CLIENT_SECRET,
			this.env.GOOGLE_REDIRECT_URI,
		);

		this.authService = new AuthService(googleClient, this.db, this.jwtService);
	}

	async fetch() {
		return Response.json({
			message: 'User Service is running',
			version: '1.0.0',
			status: 'healthy',
		});
	}

	async getAuthUrl(provider: ProviderType) {
		return this.authService.getAuthUrl(provider);
	}

	async loginOrSignup(provider: ProviderType, code: string) {
		return this.authService.loginOrSignup(provider, code);
	}

	async logout(userId: string) {
		return this.authService.logout(userId);
	}

	async withdraw(userId: string) {
		return this.authService.withdraw(userId);
	}
}

export default UserServiceWorker;
