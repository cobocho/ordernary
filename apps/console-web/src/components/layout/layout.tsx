import { Outlet } from 'react-router-dom';
import { AppSidebar } from './app-sidebar';

export const Layout = () => {
	return (
		<div>
			<AppSidebar />
			<Outlet />
		</div>
	);
};
