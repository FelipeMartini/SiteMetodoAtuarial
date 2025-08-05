'use client';

import { styled } from '@mui/material/styles';
import FusePageCarded from '@fuse/core/FusePageCarded';
import DemoHeader from '../../../../ui/page-layouts/DemoHeader';
import DemoContent from '../../../../ui/page-layouts/DemoContent';

const Root = styled(FusePageCarded)({
	'& .FusePageCarded-header': {},
	'& .FusePageCarded-toolbar': {},
	'& .FusePageCarded-content': {},
	'& .FusePageCarded-sidebarHeader': {},
	'& .FusePageCarded-sidebarContent': {}
});

/**
 * The CardedFullWidthPageScroll page.
 */
function CardedFullWidthPageScrollComponent() {
	return (
		<Root
			header={<DemoHeader />}
			content={<DemoContent />}
			scroll="page"
		/>
	);
}

export default CardedFullWidthPageScrollComponent;
