import { Outlet } from 'react-router-dom';
import { AppSidebar } from './app-sidebar';
import { SidebarInset, SidebarProvider } from '@ordernary/design-system';

export const Layout = () => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<div className="w-full p-8">
				<Outlet />
			</div>
		</SidebarProvider>
	);
};
