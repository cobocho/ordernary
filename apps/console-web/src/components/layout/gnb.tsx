import { cn } from '@ordernary/design-system';
import {
	BookMarked,
	CircleDollarSign,
	ConciergeBell,
	Home,
	HomeIcon,
	Store,
	type LucideIcon,
} from 'lucide-react';

const MENU_ITEMS = [
	{
		title: '홈',
		icon: Home,
		href: '/',
		isActive: true,
	},
	{
		title: '매장 관리',
		icon: Store,
		href: '/',
		isActive: false,
	},
	{
		title: '주문 관리',
		icon: ConciergeBell,
		href: '/',
		isActive: false,
	},
	{
		title: '웨이팅 관리',
		icon: BookMarked,
		href: '/',
		isActive: false,
	},
	{
		title: '정산',
		icon: CircleDollarSign,
		href: '/',
		isActive: false,
	},
];

export function GNB() {
	return (
		<div className="flex flex-col gap-16">
			{MENU_ITEMS.map((item) => (
				<MenuItem
					key={item.title}
					{...item}
				/>
			))}
		</div>
	);
}

interface MenuItemProps {
	title: string;
	icon: LucideIcon;
	href: string;
	isActive: boolean;
}

function MenuItem({ title, icon: Icon, href, isActive }: MenuItemProps) {
	return (
		<div className="flex items-center gap-2 flex-col cursor-pointer transition-all group">
			<div
				className={cn(
					'w-12 bg-neutral-300 rounded-full h-12 flex group-hover:-translate-y-1 group-hover:scale-125 items-center duration-500 justify-center drop-shadow-lg group-hover:bg-neutral-400 group-hover:drop-shadow-xl transition-all',
					isActive && 'bg-neutral-900 hover:bg-neutral-900',
				)}
			>
				<Icon
					className={cn(
						'text-neutral-600 group-hover:text-neutral-200',
						isActive && 'text-white',
					)}
				/>
			</div>
			<span
				className={cn(
					'text-xs font-medium text-nowrap group-hover:font-medium',
					isActive && 'font-bold',
				)}
			>
				{title}
			</span>
		</div>
	);
}
