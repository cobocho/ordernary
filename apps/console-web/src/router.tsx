import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/layout';
import { LoginPage } from './pages/login-page';
import { HomePage } from './pages/home-page';
import { StoreListPage } from './pages/store/store-list';

export const router = createBrowserRouter([
	{
		element: <Layout />,
		children: [
			{
				path: '/login',
				element: <LoginPage />,
			},
			{
				path: '/',
				element: <HomePage />,
			},
			{
				path: '/store',
				element: <StoreListPage />,
			},
		],
	},
]);
