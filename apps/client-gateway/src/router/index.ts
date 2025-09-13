import { router } from '../lib/trpc';
import { userRouter } from './user/user.router';

export default router({
	user: userRouter,
});
