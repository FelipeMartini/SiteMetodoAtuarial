import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import clsx from 'clsx';
import { memo, useEffect, useState } from 'react';
import FuseNavigation from '@fuse/core/FuseNavigation';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import isUrlInChildren from '@fuse/core/FuseNavigation/isUrlInChildren';
import { Theme } from '@mui/system';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import UserMenu from 'src/components/theme-layouts/components/UserMenu';
import usePathname from '@fuse/hooks/usePathname';
import useNavigationItems from '@/components/theme-layouts/components/navigation/hooks/useNavigationItems';
import { useNavbarContext } from '@/components/theme-layouts/components/navbar/contexts/NavbarContext/useNavbarContext';

const Root = styled('div')(({ theme }) => ({
	backgroundColor: theme.vars.palette.background.default,
	color: theme.vars.palette.text.primary
}));

type StyledPanelProps = {
	theme?: Theme;
	opened?: boolean;
};

const StyledPanel = styled(FuseScrollbars)<StyledPanelProps>(({ theme }) => ({
	backgroundColor: theme.vars.palette.background.default,
	color: theme.vars.palette.text.primary,
	transition: theme.transitions.create(['opacity'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.shortest
	}),
	opacity: 0,
	pointerEvents: 'none',
	minHeight: 0,
	variants: [
		{
			props: ({ opened }) => opened,
			style: {
				opacity: 1,
				pointerEvents: 'initial'
			}
		}
	]
}));

/**
 * Check if the item needs to be opened.
 */
function needsToBeOpened(pathname: string, item: FuseNavItemType) {
	return pathname && isUrlInChildren(item, pathname);
}

type NavbarStyle2ContentProps = { className?: string };

/**
 * The navbar style 3 content.
 */
function NavbarStyle2Content(props: NavbarStyle2ContentProps) {
	const { className = '' } = props;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { data: navigation } = useNavigationItems();
	const { closeMobileNavbar } = useNavbarContext();
	const [selectedNavigation, setSelectedNavigation] = useState<FuseNavItemType[]>([]);
	const [panelOpen, setPanelOpen] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		navigation?.forEach((item) => {
			if (needsToBeOpened(pathname, item)) {
				setSelectedNavigation([item]);
			}
		});
	}, [navigation, pathname]);

	function handleParentItemClick(selected: FuseNavItemType) {
		/** if there is no child item do not set/open panel
		 */
		if (!selected.children) {
			setSelectedNavigation([]);
			setPanelOpen(false);
			return;
		}

		/**
		 * If navigation already selected toggle panel visibility
		 */
		if (selectedNavigation[0]?.id === selected.id) {
			setPanelOpen(!panelOpen);
		} else {
			/**
			 * Set navigation and open panel
			 */
			setSelectedNavigation([selected]);
			setPanelOpen(true);
		}
	}

	function handleChildItemClick() {
		setPanelOpen(false);

		if (isMobile) {
			closeMobileNavbar();
		}
	}

	return (
		<ClickAwayListener onClickAway={() => setPanelOpen(false)}>
			<Root className={clsx('flex h-full flex-auto', className)}>
				<div
					id="fuse-navbar-side-panel"
					className="flex h-full shrink-0 flex-col items-center"
				>
					<img
						className="my-4 w-6"
						src="/assets/images/logo/logo.svg"
						alt="logo"
					/>

					<FuseScrollbars
						className="flex min-h-0 w-full flex-1 flex-col justify-start overflow-x-hidden overflow-y-auto"
						option={{
							suppressScrollX: true,
							wheelPropagation: false
						}}
					>
						<FuseNavigation
							className={clsx('navigation min-h-full shrink-0')}
							navigation={navigation}
							layout="vertical-2"
							onItemClick={handleParentItemClick}
							firstLevel
							selectedId={selectedNavigation[0]?.id}
						/>
					</FuseScrollbars>

					<div className="flex w-full shrink-0 items-center justify-center py-2">
						<UserMenu onlyAvatar />
					</div>
				</div>

				{selectedNavigation.length > 0 && (
					<StyledPanel
						id="fuse-navbar-panel"
						opened={panelOpen}
						className={clsx('overflow-x-hidden overflow-y-auto shadow-sm')}
						option={{ suppressScrollX: true, wheelPropagation: false }}
					>
						<FuseNavigation
							className={clsx('navigation')}
							navigation={selectedNavigation}
							layout="vertical"
							onItemClick={handleChildItemClick}
						/>
					</StyledPanel>
				)}
			</Root>
		</ClickAwayListener>
	);
}

export default memo(NavbarStyle2Content);
