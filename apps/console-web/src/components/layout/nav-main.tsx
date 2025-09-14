'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';

import {
	cn,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@ordernary/design-system';
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@ordernary/design-system';

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: LucideIcon;
		isActive?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton
									tooltip={item.title}
									className={cn('h-12 px-4', item.isActive && 'bg-neutral-200')}
								>
									{item.icon && (
										<item.icon
											className={cn(
												'scale-150',
												item.isActive && 'text-red-500',
											)}
										/>
									)}
									<span
										className={cn(
											'font-bold ml-2 text-neutral-700',
											item.isActive && 'text-black',
										)}
									>
										{item.title}
									</span>
									<ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton asChild>
												<a
													href={subItem.url}
													className="font-medium"
												>
													<span>{subItem.title}</span>
												</a>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
