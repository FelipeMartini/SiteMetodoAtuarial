import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { ReactNode } from 'react';

/**
 * Props for the FusePageCardedSidebarContent component.
 */
type FusePageCardedSidebarContentProps = {
	innerScroll?: boolean;
	children?: ReactNode;
	content?: ReactNode;
};

/**
 * The FusePageCardedSidebarContent component is a content container for the FusePageCardedSidebar component.
 */
function FusePageCardedSidebarContent(props: FusePageCardedSidebarContentProps) {
	const { innerScroll, children, content } = props;

	if (!content && !children) {
		return null;
	}

	return (
		<FuseScrollbars enable={innerScroll}>
			<div className="FusePageCarded-sidebarContent lg:min-w-0">{content || children}</div>
		</FuseScrollbars>
	);
}

export default FusePageCardedSidebarContent;
