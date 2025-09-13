import UserServiceWorker from '../../../user-service/src';

export type Env = {
	USER_SERVICE: Service<typeof UserServiceWorker>;
};

export type HonoContext = {
	env: Env;
};
