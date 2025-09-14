'use client';

import * as React from 'react';
import { BellRing, Store } from 'lucide-react';

import { NavMain } from './nav-main';
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarRail,
} from '@ordernary/design-system';
import { ROUTES } from '../../constants/route';

// This is sample data.
const data = [
	{
		title: '매장 관리',
		url: ROUTES.STORE_LIST,
		icon: Store,
		isActive: false,
		items: [
			{
				title: '매장 수정',
				url: '#',
			},
			{
				title: '매장 삭제',
				url: '#',
			},
		],
	},
	{
		title: '가게 주문 관리',
		url: '#',
		icon: BellRing,
		isActive: true,
		items: [
			{
				title: '주문 조회',
				url: '#',
			},
			{
				title: '주문 수정',
				url: '#',
			},
		],
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			className="shadow-xl"
			collapsible="icon"
			{...props}
		>
			<SidebarHeader>
				<h1>Ordernary</h1>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data} />
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	);
}
