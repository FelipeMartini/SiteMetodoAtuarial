import Drawer from '@mui/material/Drawer';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import clsx from 'clsx';
import { useCallback, useEffect, useImperativeHandle, useState, ReactNode } from 'react';
import { SwipeableDrawerProps } from '@mui/material/SwipeableDrawer';
import FusePageCardedSidebarContent from './FusePageCardedSidebarContent';
import useThemeMediaQuery from '../../hooks/useThemeMediaQuery';

/**
 * Props for the FusePageCardedSidebar component.
 */
export type FusePageCardedSidebarProps = {
	open?: boolean;
	position?: SwipeableDrawerProps['anchor'];
	variant?: SwipeableDrawerProps['variant'];
	onClose?: () => void;
	children?: ReactNode;
	content?: ReactNode;
	ref?: React.RefObject<{ toggleSidebar: (T: boolean) => void }>;
	width?: number;
};

/**
 * The FusePageCardedSidebar component is a sidebar for the FusePageCarded component.
 */
function FusePageCardedSidebar(props: FusePageCardedSidebarProps) {
	const { open = true, position, variant, onClose = () => {}, ref, width = 240, children, content } = props;

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const [isOpen, setIsOpen] = useState(open);

	const handleToggleDrawer = useCallback((val: boolean) => {
		setIsOpen(val);
	}, []);

	useImperativeHandle(ref, () => ({
		toggleSidebar: handleToggleDrawer
	}));

	useEffect(() => {
		handleToggleDrawer(open);
	}, [handleToggleDrawer, open]);

	if (!content && !children) {
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
						root: clsx('FusePageCarded-sidebarWrapper', variant),
						paper: clsx(
							'FusePageCarded-sidebar',
							variant,
							position === 'left' ? 'FusePageCarded-leftSidebar' : 'FusePageCarded-rightSidebar',
							'max-w-full min-w-80'
						)
					}}
					ModalProps={{
						keepMounted: true // Better open performance on mobile.
					}}
					slotProps={{
						backdrop: {
							classes: {
								root: 'FusePageCarded-backdrop'
							}
						}
					}}
					sx={{ position: 'absolute', '& .MuiPaper-root': { width: isMobile ? 'auto' : `${width}px` } }}
				>
					<FusePageCardedSidebarContent {...props} />
				</SwipeableDrawer>
			)}
			{variant === 'permanent' && !isMobile && (
				<Drawer
					variant="permanent"
					anchor={position}
					className={clsx(
						'FusePageCarded-sidebarWrapper',
						variant,
						isOpen ? 'opened' : 'closed',
						position === 'left' ? 'FusePageCarded-leftSidebar' : 'FusePageCarded-rightSidebar'
					)}
					open={isOpen}
					onClose={onClose}
					classes={{
						paper: clsx('FusePageCarded-sidebar', variant)
					}}
					sx={{ '& .MuiPaper-root': { width: `${width}px` } }}
				>
					<FusePageCardedSidebarContent {...props} />
				</Drawer>
			)}
		</>
	);
}

export default FusePageCardedSidebar;
