import { UserServiceWorkerEntrypoint } from '@ordernary/user-service/types';

export type Env = {
	USER_SERVICE: Service<UserServiceWorkerEntrypoint>;
	JWT_ACCESS_TOKEN_EXPIRES_IN: string;
	JWT_REFRESH_TOKEN_EXPIRES_IN: string;
};

export type HonoContext = {
	env: Env;
};
