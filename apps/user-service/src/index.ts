import { WorkerEntrypoint } from 'cloudflare:workers';
import { drizzle } from 'drizzle-orm/d1';
import { AuthService } from './services/auth-service';
import { GoogleProvider } from './providers/google-provider';
import { JwtService } from '@ordernary/jwt-service';
import ms from 'ms';
import { StateService } from './services/state-service';
import { ProviderType } from './db/schema';
import { UserService } from './services/user-service';

interface Env {
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REDIRECT_URI: string;
	JWT_SECRET: string;
	JWT_ISSUER: string;
	JWT_ACCESS_TOKEN_EXPIRES_IN: string;
	JWT_REFRESH_TOKEN_EXPIRES_IN: string;
	USER_DB: D1Database;
	CONSOLE_ORIGIN: string;
	APP_ORIGIN: string;
	STATE_SECRET: string;
	STATE_ISSUER: string;
}

class UserServiceWorker extends WorkerEntrypoint<Env> {
	private authService: AuthService;

	private userService: UserService;

	private jwtService: JwtService;

	private stateService: StateService;

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

		this.stateService = new StateService(
			this.env.STATE_SECRET,
			this.env.STATE_ISSUER,
		);

		this.authService = new AuthService(
			googleClient,
			this.db,
			this.jwtService,
			this.stateService,
			[this.env.CONSOLE_ORIGIN, this.env.APP_ORIGIN],
		);

		this.userService = new UserService(this.db, this.jwtService);
	}

	async fetch() {
		return Response.json({
			message: 'User Service is running',
			version: '1.0.0',
			status: 'healthy',
		});
	}

	async getAuthUrl(
		provider: ProviderType,
		client: 'console' | 'app',
		returnTo: string,
	) {
		return this.authService.getAuthUrl(provider, client, returnTo, {
			console: this.env.CONSOLE_ORIGIN,
			app: this.env.APP_ORIGIN,
		});
	}

	async handleCallback(
		provider: ProviderType,
		code: string,
		stateToken: string,
	) {
		return this.authService.handleCallback(provider, code, stateToken);
	}

	async getProfile(accessToken: string) {
		return this.userService.getCurrentUser(accessToken);
	}

	async logout(userId: string) {
		return this.authService.logout(userId);
	}

	async withdraw(userId: string) {
		return this.authService.withdraw(userId);
	}
}

export default UserServiceWorker;
