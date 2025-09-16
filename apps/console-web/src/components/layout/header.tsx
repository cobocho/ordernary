import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@ordernary/design-system';
import { CheckIcon, ChevronDown, LogOutIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
	const username = 'John Doe';
	const userPicture =
		'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2680&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

	const storename = '테스트 매장';

	const [open, setOpen] = useState(false);

	const storeList = ['테스트 매장', '1번 매장', '2번 매장', '3번 매장'];

	return (
		<DropdownMenu
			open={open}
			onOpenChange={setOpen}
		>
			<DropdownMenuTrigger asChild>
				<div className="flex relative hover:scale-105 w-64 cursor-pointer transition-all duration-500 gap-4 items-center bg-black/80 py-3 pl-3 pr-6 rounded-full border border-neutral-300 drop-shadow-xl backdrop-blur-lg">
					<img
						src={userPicture}
						alt="User Picture"
						className="w-14 h-14 rounded-full border border-neutral-200"
					/>
					<div className="flex flex-col">
						<span className="text-xs text-white">안녕하세요!</span>
						<div className="flex items-center gap-0.5">
							<span className="font-bold text-white">{username}</span>
							<span className="text-neutral-200 text-sm">님!</span>
						</div>
						<span className="text-neutral-300 text-xs">{storename}</span>
					</div>
					<ChevronDown className="text-neutral-300 absolute right-4" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-60 bg-gradient-to-br from-black/80 to-black/100 text-white backdrop-blur-lg shadow-xl">
				<DropdownMenuLabel className="text-xs text-neutral-300 flex items-center justify-between">
					매장 선택
					<button className="text-xs bg-neutral-100 text-black rounded-full pl-3 pr-2 gap-1 flex items-center">
						매장 추가
						<PlusIcon className="w-4" />
					</button>
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-neutral-500" />
				{storeList.map((store) => (
					<DropdownMenuItem
						key={store}
						className="transition-all group flex items-center justify-between pl-4"
					>
						{store}
						{store === storename && (
							<CheckIcon className="text-white w-4 group-hover:text-black" />
						)}
					</DropdownMenuItem>
				))}
				<DropdownMenuLabel className="text-xs text-neutral-300 mt-4">
					프로필
				</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-neutral-500" />
				<DropdownMenuItem className="transition-all group pl-4">
					프로필 수정
				</DropdownMenuItem>
				<DropdownMenuItem className="transition-all group pl-4">
					플랜 변경
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-neutral-500" />
				<DropdownMenuItem className="flex justify-end text-neutral-400 group">
					<LogOutIcon className="w-4 text-neutral-300 group-hover:text-black" />
					로그아웃
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
