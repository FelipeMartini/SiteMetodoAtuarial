import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import clsx from 'clsx';
import { ReactNode, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer';
import FusePageSimpleSidebarContent from './FusePageSimpleSidebarContent';
import useThemeMediaQuery from '../../hooks/useThemeMediaQuery';

/**
 * Props for the FusePageSimpleSidebar component.
 */
export type FusePageSimpleSidebarProps = {
	open?: boolean;
	position?: SwipeableDrawerProps['anchor'];
	variant?: SwipeableDrawerProps['variant'];
	onClose?: () => void;
	content?: ReactNode;
	children?: ReactNode;
	ref?: React.RefObject<{ toggleSidebar: (T: boolean) => void }>;
	width?: number;
};

/**
 * The FusePageSimpleSidebar component.
 */
function FusePageSimpleSidebar(props: FusePageSimpleSidebarProps) {
	const { open = true, position, variant, onClose = () => {}, ref, width = 240, children, content } = props;

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [isOpen, setIsOpen] = useState(open);

	useImperativeHandle(ref, () => ({
		toggleSidebar: handleToggleDrawer
	}));

	const handleToggleDrawer = useCallback((val: boolean) => {
		setIsOpen(val);
	}, []);

	useEffect(() => {
		handleToggleDrawer(open);
	}, [handleToggleDrawer, open]);

	if (!children && !content) {
		return null;
	}

	return (
		<>
			{((variant === 'permanent' && isMobile) || variant !== 'permanent') && (
				<SwipeableDrawer
					variant="temporary"
					anchor={position}
					open={isOpen}
					onOpen={() => {}}
					onClose={() => onClose()}
					disableSwipeToOpen
					classes={{
						root: clsx('FusePageSimple-sidebarWrapper', variant),
						paper: clsx(
							'FusePageSimple-sidebar',
							variant,
							position === 'left' ? 'FusePageSimple-leftSidebar' : 'FusePageSimple-rightSidebar',
							'max-w-full min-w-80'
						)
					}}
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
					// container={rootRef.current}
					slotProps={{
						backdrop: {
							classes: {
								root: 'FusePageSimple-backdrop'
							}
						}
					}}
					sx={{ position: 'absolute', '& .MuiPaper-root': { width: isMobile ? 'auto' : `${width}px` } }}
				>
					<FusePageSimpleSidebarContent {...props} />
				</SwipeableDrawer>
			)}
			{variant === 'permanent' && !isMobile && (
				<Drawer
					variant="permanent"
					anchor={position}
					className={clsx(
						'FusePageSimple-sidebarWrapper',
						variant,
						isOpen ? 'opened' : 'closed',
						position === 'left' ? 'FusePageSimple-leftSidebar' : 'FusePageSimple-rightSidebar'
					)}
					open={isOpen}
					onClose={onClose}
					classes={{
						paper: clsx('FusePageSimple-sidebar border-0 w-full', variant)
					}}
					sx={{ '& .MuiPaper-root': { width: `${width}px` } }}
				>
					<FusePageSimpleSidebarContent {...props} />
				</Drawer>
			)}
		</>
	);
}

export default FusePageSimpleSidebar;
