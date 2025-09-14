import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/layout';
import { LoginPage } from './pages/login-page';

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/login',
				element: <LoginPage />,
			},
		],
	},
]);
