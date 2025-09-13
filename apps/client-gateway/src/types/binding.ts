import UserServiceWorker from '../../../user-service/src';

export type Env = {
	USER_SERVICE: Service<typeof UserServiceWorker>;
	JWT_ACCESS_TOKEN_EXPIRES_IN: string;
	JWT_REFRESH_TOKEN_EXPIRES_IN: string;
};

export type HonoContext = {
	env: Env;
};
