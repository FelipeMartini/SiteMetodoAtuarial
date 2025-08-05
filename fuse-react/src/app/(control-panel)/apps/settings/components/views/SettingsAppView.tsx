'use client';

import { useEffect, useState } from 'react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FusePageSimple from '@fuse/core/FusePageSimple';
import usePathname from '@fuse/hooks/usePathname';
import SettingsAppSidebarContent from '../ui/SettingsAppSidebarContent';
import SettingsAppHeader from '../ui/SettingsAppHeader';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-contentWrapper': {
		paddingTop: 2,
		paddingLeft: 2
	},
	'& .FusePageSimple-content': {
		boxShadow: theme.vars.shadows[2],
		borderRadius: '12px 0 0 0',
		[theme.breakpoints.down('md')]: {
			borderRadius: '12px 12px 0 0'
		},
		backgroundColor: theme.vars.palette.background.paper
	},
	'& .FusePageSimple-sidebarWrapper': {
		border: 'none'
	},
	'& .FusePageSimple-sidebarContent': {
		backgroundColor: theme.vars.palette.background.default
	}
}));

type SettingsAppProps = {
	children?: React.ReactNode;
};

/**
 * The notes app.
 */
function SettingsAppView(props: SettingsAppProps) {
	const { children } = props;
	const pathname = usePathname();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) {
			setLeftSidebarOpen(false);
		}
	}, [pathname, isMobile]);

	return (
		<Root
			content={
				<div className="max-w-2xl flex-auto p-4 md:p-6">
					<SettingsAppHeader
						className="mb-4"
						onSetSidebarOpen={setLeftSidebarOpen}
					/>
					{children}
				</div>
			}
			leftSidebarProps={{
				open: leftSidebarOpen,
				onClose: () => {
					setLeftSidebarOpen(false);
				},
				content: <SettingsAppSidebarContent onSetSidebarOpen={setLeftSidebarOpen} />,
				width: 320
			}}
			scroll={isMobile ? 'page' : 'content'}
		/>
	);
}

export default SettingsAppView;
