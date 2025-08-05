import FuseHighlight from '@fuse/core/FuseHighlight';
import Card from '@mui/material/Card';
import clsx from 'clsx';
import { ElementType, ReactNode, useState } from 'react';
import DemoFrame from './DemoFrame';
import FuseSvgIcon from '../FuseSvgIcon';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { darken } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

type FuseExampleProps = {
	name?: string;
	raw?: string;
	showCode?: boolean;
	component: ElementType;
	iframe?: ReactNode;
	className: string;
};

/**
 * FuseExample component gives a visual display as well as code for a component example.
 * It consists of two tabs, a visual tab and code tab.
 */
function FuseExample(props: FuseExampleProps) {
	const { component: Component, raw, iframe, className, name = '', showCode: defaultShowCode = false } = props;
	const [open, setOpen] = useState(false);

	const [showCode, setShowCode] = useState(defaultShowCode);

	function toggleShowCode() {
		setShowCode(!showCode);
	}

	function handleCopy() {
		navigator.clipboard.writeText(raw);
		setOpen(true);
		setTimeout(() => {
			setOpen(false);
		}, 800);
	}

	return (
		<Card className={clsx(className, 'not-prose border-divider rounded-md border shadow-xs')}>
			{Component && (
				<Box className="relative flex max-w-full justify-center p-4">
					{iframe ? (
						<DemoFrame name={name}>
							<Component />
						</DemoFrame>
					) : (
						<Component />
					)}
				</Box>
			)}
			<Box
				className="flex items-center justify-end gap-3 border-t p-2"
				sx={{
					backgroundColor: (theme) =>
						darken(theme.palette.background.paper, theme.palette.mode === 'light' ? 0.02 : 0.2)
				}}
			>
				<Tooltip
					title="Copied!"
					open={open}
					slotProps={{ popper: { placement: 'top' } }}
					arrow
				>
					<Button
						variant="text"
						onClick={handleCopy}
						size="small"
						className=""
						startIcon={<FuseSvgIcon>lucide:copy</FuseSvgIcon>}
					>
						Copy
					</Button>
				</Tooltip>
				<Button
					className="min-w-30"
					onClick={toggleShowCode}
					variant="outlined"
					size="small"
					startIcon={<FuseSvgIcon>lucide:code-xml</FuseSvgIcon>}
				>
					{showCode ? 'Hide Code' : 'Show Code'}
				</Button>
			</Box>
			{showCode && (
				<div className="flex flex-1 flex-col">
					<FuseHighlight
						component="pre"
						className="language-javascript w-full"
						copy={false}
					>
						{raw}
					</FuseHighlight>
				</div>
			)}
		</Card>
	);
}

export default FuseExample;
