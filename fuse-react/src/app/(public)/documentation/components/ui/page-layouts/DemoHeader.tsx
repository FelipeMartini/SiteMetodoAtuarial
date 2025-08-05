import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';

type DemoHeaderProps = {
	children?: React.ReactNode;
	className?: string;
	leftSidebarToggle?: () => void;
	rightSidebarToggle?: () => void;
};

/**
 * The DemoHeader component.
 */
function DemoHeader(props: DemoHeaderProps) {
	const { children, leftSidebarToggle, rightSidebarToggle, className } = props;

	return (
		<div className={clsx('not-prose flex w-full flex-col gap-4 py-4', className)}>
			<PageBreadcrumb maxItems={3} />

			<div className="flex w-full items-center gap-3">
				{leftSidebarToggle && (
					<IconButton
						onClick={leftSidebarToggle}
						aria-label="toggle sidebar"
						className="border-divider border"
					>
						<FuseSvgIcon>lucide:menu</FuseSvgIcon>
					</IconButton>
				)}

				<div className="flex-auto">
					<Typography className="text-4xl leading-none font-extrabold tracking-tight">
						Page heading
					</Typography>
				</div>

				{rightSidebarToggle && (
					<IconButton
						onClick={rightSidebarToggle}
						aria-label="toggle sidebar"
						className="border-divider border"
					>
						<FuseSvgIcon>lucide:menu</FuseSvgIcon>
					</IconButton>
				)}
			</div>
			{children}
		</div>
	);
}

export default DemoHeader;
