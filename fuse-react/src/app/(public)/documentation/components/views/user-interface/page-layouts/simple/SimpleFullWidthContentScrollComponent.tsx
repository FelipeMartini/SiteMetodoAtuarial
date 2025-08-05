'use client';

import { styled } from '@mui/material/styles';
import FusePageSimple from '@fuse/core/FusePageSimple';
import DemoHeader from '../../../../ui/page-layouts/DemoHeader';
import DemoContent from '../../../../ui/page-layouts/DemoContent';

const Root = styled(FusePageSimple)(() => ({
	'& .FusePageSimple-header': {},
	'& .FusePageSimple-toolbar': {},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {}
}));

/**
 * The SimpleFullWidthContentScroll page.
 */
function SimpleFullWidthContentScrollComponent() {
	return (
		<Root
			header={<DemoHeader className="px-6" />}
			content={<DemoContent />}
			scroll="content"
		/>
	);
}

export default SimpleFullWidthContentScrollComponent;
