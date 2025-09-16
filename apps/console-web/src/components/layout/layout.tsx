import { Outlet } from 'react-router-dom';
import { GNB } from './gnb';

export const Layout = () => {
	return (
		<div className="flex gap-4">
			<div className="h-screen flex items-center px-6">
				<GNB />
			</div>
			<div className="w-full p-8">
				<Outlet />
			</div>
		</div>
	);
};
