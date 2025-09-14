import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@ordernary/client-gateway/types';

export const trpc = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: 'http://client-gateway-dev.gyepi7676.workers.dev/trpc',
		}),
	],
});
