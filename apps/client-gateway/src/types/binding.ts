import UserServiceWorker from '../../../user-service/src';
import { JwtService } from '@ordernary/jwt-service';

export type Env = {
	USER_SERVICE: Service<UserServiceWorker>;
	JWT_ACCESS_TOKEN_EXPIRES_IN: string;
	JWT_REFRESH_TOKEN_EXPIRES_IN: string;
	JWT_SECRET: string;
	JWT_ISSUER: string;
};

export type HonoContext = {
	env: Env;
	JWT_SERVICE: JwtService;
	cookies: {
		accessToken: string;
		refreshToken: string;
	};
};
