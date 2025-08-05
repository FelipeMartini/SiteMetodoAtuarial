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
 * The CardedFullWidthNormalScroll page
 */
function CardedFullWidthNormalScrollComponent() {
	return (
		<Root
			header={<DemoHeader />}
			content={<DemoContent />}
			scroll="normal"
		/>
	);
}

export default CardedFullWidthNormalScrollComponent;
