import { Outlet } from 'react-router-dom';
import { GNB } from './gnb';
import { Header } from './header';

export const Layout = () => {
	return (
		<div className="flex gap-4 bg-neutral-50">
			<div className="fixed top-8 right-12">
				<Header />
			</div>
			<div className="h-screen flex items-center px-6">
				<GNB />
			</div>
			<div className="w-full p-8">
				<Outlet />
			</div>
		</div>
	);
};
