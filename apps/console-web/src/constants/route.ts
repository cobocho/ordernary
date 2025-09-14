export const ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	WORKSPACE_LIST: '/workspace',
	WORKSPACE_DETAIL: (workspaceId: string) => `/workspace/${workspaceId}`,
	STORE_LIST: (workspaceId: string) => `/workspace/${workspaceId}/store`,
	STORE_DETAIL: (workspaceId: string, storeId: string) =>
		`/workspace/${workspaceId}/store/${storeId}`,
	STORE_MENU_MANAGEMENT: (workspaceId: string, storeId: string) =>
		`/workspace/${workspaceId}/store/${storeId}/menu`,
	STORE_ORDER_MANAGEMENT: (workspaceId: string, storeId: string) =>
		`/workspace/${workspaceId}/store/${storeId}/orders`,
};
