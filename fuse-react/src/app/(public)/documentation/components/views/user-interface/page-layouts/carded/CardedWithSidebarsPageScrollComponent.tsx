'use client';

import { styled } from '@mui/material/styles';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useEffect, useState } from 'react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import DemoHeader from '../../../../ui/page-layouts/DemoHeader';
import DemoContent from '../../../../ui/page-layouts/DemoContent';
import DemoSidebar from '../../../../ui/page-layouts/DemoSidebar';

const Root = styled(FusePageCarded)(() => ({
	'& .FusePageCarded-header': {},
	'& .FusePageCarded-toolbar': {},
	'& .FusePageCarded-content': {},
	'& .FusePageCarded-sidebarHeader': {},
	'& .FusePageCarded-sidebarContent': {}
}));

/**
 * The CardedWithSidebarsContentScroll page.
 */
function CardedWithSidebarsPageScrollComponent() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(!isMobile);

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
		setRightSidebarOpen(!isMobile);
	}, [isMobile]);

	return (
		<Root
			header={
				<DemoHeader
					leftSidebarToggle={() => {
						setLeftSidebarOpen(!leftSidebarOpen);
					}}
					rightSidebarToggle={() => {
						setRightSidebarOpen(!rightSidebarOpen);
					}}
				/>
			}
			content={<DemoContent />}
			leftSidebarProps={{
				open: leftSidebarOpen,
				onClose: () => {
					setLeftSidebarOpen(false);
				},
				content: <DemoSidebar />
			}}
			rightSidebarProps={{
				open: rightSidebarOpen,
				onClose: () => {
					setRightSidebarOpen(false);
				},
				content: <DemoSidebar />
			}}
			scroll="page"
		/>
	);
}

export default CardedWithSidebarsPageScrollComponent;
