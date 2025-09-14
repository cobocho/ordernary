import { UserServiceWorkerEntrypoint } from '@ordernary/user-service/types';
import { WorkspaceServiceWorkerEntrypoint } from '@ordernary/workspace-service/types';

export type Env = {
	USER_SERVICE: Service<UserServiceWorkerEntrypoint>;
	WORKSPACE_SERVICE: Service<WorkspaceServiceWorkerEntrypoint>;
	JWT_ACCESS_TOKEN_EXPIRES_IN: string;
	JWT_REFRESH_TOKEN_EXPIRES_IN: string;
};

export type HonoContext = {
	env: Env;
};
