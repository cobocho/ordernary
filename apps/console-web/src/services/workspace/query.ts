import { queryOptions } from '@tanstack/react-query';
import { trpc } from '../../lib/trpc';

export const workspaceQueryOptions = {
	getWorkspaces: queryOptions({
		queryKey: ['workspaces'],
		queryFn: () => trpc.workspace.getUserWorkspaces.query(),
	}),
};
