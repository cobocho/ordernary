import { Hono } from 'hono';
import UserServiceWorker from '../../user-service/src';
import { callbackRouter, userRouter } from './router/user/user.router';
import { trpcServer } from '@hono/trpc-server';
import appRouter from './router';

interface Env {
	USER_SERVICE: Service<typeof UserServiceWorker>;
}

const app = new Hono<{ Bindings: Env }>();

app.get('/', (c) => {
	return c.text('Hello Hono!');
});

app.use(
	'/trpc/*',
	trpcServer({
		router: appRouter,
	}),
);
app.route('/user/callback', callbackRouter);

export default app;
