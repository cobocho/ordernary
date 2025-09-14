import { Button } from '@ordernary/design-system';
import { trpc } from '../lib/trpc';

export function LoginPage() {
	const handleLogin = async () => {
		const authUrl = await trpc.user.getAuthUrl.query({
			provider: 'google',
			client: 'console',
			returnTo: '/',
		});

		if (authUrl) {
			window.location.href = authUrl;
		}
	};

	return <Button onClick={handleLogin}>구글 로그인</Button>;
}
