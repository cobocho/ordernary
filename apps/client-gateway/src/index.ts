import { Context, Hono, HonoRequest } from 'hono';
import { initTRPC } from '@trpc/server';
import { callbackRouter, userRouter } from '@/router/user/user.router';
import { workspaceRouter } from '@/router/workspace/workspace.router';
import { trpcServer } from '@hono/trpc-server';
import { cors } from 'hono/cors';
import { Env, HonoContext } from '@/types/binding';
import { getCookie } from 'hono/cookie';
import { JwtService } from '../../../packages/services/src/jwt-service';

const app = new Hono<{ Bindings: Env }>();

const ALLOWED = ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
	'*',
	cors({
		origin: (origin) => (origin && ALLOWED.includes(origin) ? origin : ''),
		credentials: true, // <- 중요: Allow-Credentials: true
		allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
		exposeHeaders: ['Content-Type', 'Authorization'],
		maxAge: 600,
	}),
);

app.get('/', (c) => {
	return c.json({
		message: 'Client Gateway is running',
		version: '0.0.1',
		status: 'healthy',
	});
});

export const t = initTRPC.context<HonoContext>().create();

const contextCheck = t.middleware(async ({ ctx, next }) => {
	return next({ ctx: { ...ctx } });
});

export const protectedProcedure = t.procedure.use(contextCheck);

export const router = t.router;

export const publicProcedure = t.procedure;

export const appRouter = router({
	user: userRouter,
	workspace: workspaceRouter,
	test: router({
		getTest: protectedProcedure.query(async ({ ctx }) => {
			console.log(ctx.cookies);
			return { message: 'Hello, world!' };
		}),
	}),
});

app.route('/auth/callback', callbackRouter);

app.use(
	'/trpc/*',
	trpcServer({
		router: appRouter,
		createContext: (opts, c) => {
			const accessToken = getCookie(c, JwtService.accessTokenCookieName);
			const refreshToken = getCookie(c, JwtService.refreshTokenCookieName);

			const context: Omit<HonoContext, 'env'> = {
				cookies: {
					accessToken: accessToken ?? '',
					refreshToken: refreshToken ?? '',
				},
			};

			return context;
		},
	}),
);

app.onError((err, c) => {
	return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

export default app;
