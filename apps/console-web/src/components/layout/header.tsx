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

	const currentStore = {
		name: '테스트 매장',
		storeId: '1',
		isOwner: true,
	};

	const [open, setOpen] = useState(false);

	const storeList = [
		{
			name: '테스트 매장',
			storeId: '1',
			isOwner: true,
		},
		{
			name: '1번 매장',
			storeId: '2',
			isOwner: false,
		},
		{
			name: '2번 매장',
			storeId: '3',
			isOwner: false,
		},
		{
			name: '3번 매장',
			storeId: '4',
			isOwner: false,
		},
	];

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
						<span className="text-neutral-300 text-xs">
							{currentStore.name}
						</span>
					</div>
					<ChevronDown className="text-neutral-300 absolute right-4" />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-60">
				<DropdownMenuLabel className="flex items-center justify-between">
					매장 선택
					<button className="text-xs hover:bg-neutral-200 bg-neutral-100 text-black rounded-full pl-3 pr-2 gap-1 flex items-center hover:cursor-pointer hover:scale-105 transition-all duration-500">
						매장 추가
						<PlusIcon className="w-4" />
					</button>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{storeList.map((store) => (
					<DropdownMenuItem
						key={store.storeId}
						className="transition-all flex items-center justify-between pl-4"
					>
						<div className="flex">
							<span>{store.name}</span>
						</div>
						{store.storeId === currentStore.storeId && (
							<CheckIcon className="text-white w-4" />
						)}
					</DropdownMenuItem>
				))}
				<DropdownMenuLabel className="mt-4">프로필</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="transition-all pl-4">
					프로필 수정
				</DropdownMenuItem>
				<DropdownMenuItem className="transition-all pl-4">
					플랜 변경
				</DropdownMenuItem>
				<DropdownMenuLabel className="mt-4">고객센터</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="transition-all pl-4">
					이용 가이드
				</DropdownMenuItem>
				<DropdownMenuItem className="transition-all pl-4">FAQ</DropdownMenuItem>
				<DropdownMenuItem className="transition-all pl-4">
					1:1 문의하기
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="flex justify-end text-xs text-neutral-400">
					<LogOutIcon className="w-4 text-neutral-300" />
					로그아웃
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
