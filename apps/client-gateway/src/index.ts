import { Hono } from 'hono';
import { initTRPC } from '@trpc/server';
import { callbackRouter, userRouter } from '@/router/user/user.router';
import { trpcServer } from '@hono/trpc-server';
import { cors } from 'hono/cors';
import { Env, HonoContext } from '@/types/binding';

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

export const t = initTRPC.context<HonoContext>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const appRouter = router({
	user: userRouter,
});

app.route('/auth/callback', callbackRouter);

app.use(
	'/trpc/*',
	cors({
		origin: '*',
	}),
	trpcServer({
		router: appRouter,
	}),
);

export default app;
