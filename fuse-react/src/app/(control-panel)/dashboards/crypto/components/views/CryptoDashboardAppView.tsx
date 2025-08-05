'use client';
import { useEffect, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseLoading from '@fuse/core/FuseLoading';
import CryptoDashboardAppSidebar from '../ui/CryptoDashboardAppSidebar';
import CryptoDashboardAppContent from '../ui/CryptoDashboardAppContent';
import { useGetWidgets } from '../../api/hooks/widgets/useGetWidgets';
import CryptoDashboardAppHeader from '../ui/CryptoDashboardAppHeader';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-contentWrapper': {
		paddingTop: 2,
		paddingLeft: 2
	},
	'& .FusePageSimple-content': {
		boxShadow: theme.vars.shadows[2],
		borderRadius: '12px 0 0 0',
		backgroundColor: theme.vars.palette.background.paper
	},
	'& .FusePageSimple-sidebarWrapper': {
		border: 'none'
	},
	'& .FusePageSimple-sidebarContent': {
		backgroundColor: theme.vars.palette.background.default
	}
}));

/**
 * The CryptoDashboardApp page.
 */
function CryptoDashboardAppView() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

	const { data: widgets, isLoading } = useGetWidgets();

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	if (!widgets) {
		return null;
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Root
			leftSidebarProps={{
				content: <CryptoDashboardAppSidebar />,
				open: leftSidebarOpen,
				onClose: () => setLeftSidebarOpen(false),
				width: 320
			}}
			content={
				<>
					<CryptoDashboardAppHeader onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)} />
					<CryptoDashboardAppContent />
				</>
			}
		/>
	);
}

export default CryptoDashboardAppView;
