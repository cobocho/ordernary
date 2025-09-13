import { trpc } from './iib/trpc';

function App() {
	const handleLogin = async () => {
		const authUrl = await trpc.user.getAuthUrl.query({ provider: 'google' });

		if (authUrl) {
			window.location.href = authUrl;
		}
	};

	return (
		<>
			<button onClick={handleLogin}>구글 로그인</button>
		</>
	);
}

export default App;
