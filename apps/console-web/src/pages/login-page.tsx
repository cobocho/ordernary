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

	const handleTest = async () => {
		const test = await trpc.hello.query();
		console.log(test);
	};

	return (
		<div>
			<Button onClick={handleLogin}>구글 로그인</Button>
			<Button onClick={handleTest}>테스트</Button>
		</div>
	);
}
