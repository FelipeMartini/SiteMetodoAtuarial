import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { ReactNode } from 'react';

/**
 * Props for the FusePageSimpleSidebarContent component.
 */
type FusePageSimpleSidebarContentProps = {
	innerScroll?: boolean;
	children?: ReactNode;
	content?: ReactNode;
};

/**
 * The FusePageSimpleSidebarContent component is a content container for the FusePageSimpleSidebar component.
 */
function FusePageSimpleSidebarContent(props: FusePageSimpleSidebarContentProps) {
	const { innerScroll, children, content } = props;

	if (!children && !content) {
		return null;
	}

	return (
		<FuseScrollbars enable={innerScroll}>
			<div className="FusePageSimple-sidebarContent flex min-h-full flex-col lg:min-w-0">
				{content || children}
			</div>
		</FuseScrollbars>
	);
}

export default FusePageSimpleSidebarContent;
