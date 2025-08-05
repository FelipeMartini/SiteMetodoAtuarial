'use client';

import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useState } from 'react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import DemoHeader from '../../../../ui/page-layouts/DemoHeader';
import DemoContent from '../../../../ui/page-layouts/DemoContent';
import DemoSidebar from '../../../../ui/page-layouts/DemoSidebar';

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageSimple-header': {},
	'& .FusePageSimple-toolbar': {},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

/**
 * The SimpleWithSidebarsNormalScroll page.
 */
function SimpleWithSidebarsNormalScrollComponent() {
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
					className="px-6"
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
				content: <DemoSidebar />,
				open: leftSidebarOpen,
				onClose: () => setLeftSidebarOpen(false),
				width: 288
			}}
			rightSidebarProps={{
				content: <DemoSidebar />,
				open: rightSidebarOpen,
				onClose: () => setRightSidebarOpen(false),
				width: 288
			}}
			scroll="normal"
		/>
	);
}

export default SimpleWithSidebarsNormalScrollComponent;
