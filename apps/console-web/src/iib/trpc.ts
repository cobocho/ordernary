import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../client-gateway/src';

export const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: 'https://client-gateway-dev.gyepi7676.workers.dev/trpc',
		}),
	],
});
