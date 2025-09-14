import { useSuspenseQuery } from '@tanstack/react-query';
import { workspaceQueryOptions } from '../services/workspace/query';

export const HomePage = () => {
	const { data: workspaces } = useSuspenseQuery(
		workspaceQueryOptions.getWorkspaces,
	);

	console.log(workspaces);

	return <div>HomePage</div>;
};
