'use client';

import * as React from 'react';
import {
	AudioWaveform,
	BellRing,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
	Store,
} from 'lucide-react';

import { NavMain } from './nav-main';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from '@ordernary/design-system';

// This is sample data.
const data = [
	{
		title: '매장 관리',
		url: '#',
		icon: Store,
		isActive: false,
		items: [
			{
				title: '매장 추가',
				url: '#',
			},
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
