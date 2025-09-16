interface PageHeaderProps {
	title: string;
	description?: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
	return (
		<div className="flex flex-col gap-2 w-fit mb-12">
			<h1 className="text-lg font-bold">{title}</h1>
			{description && (
				<p className="text-sm text-muted-foreground">{description}</p>
			)}
		</div>
	);
};
