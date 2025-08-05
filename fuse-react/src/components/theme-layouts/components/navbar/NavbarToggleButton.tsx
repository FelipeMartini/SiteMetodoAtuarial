import IconButton from '@mui/material/IconButton';
import _ from 'lodash';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { IconButtonProps } from '@mui/material/IconButton';
import useFuseLayoutSettings from '@fuse/core/FuseLayout/useFuseLayoutSettings';
import useFuseSettings from '@fuse/core/FuseSettings/hooks/useFuseSettings';
import { useNavbarContext } from './contexts/NavbarContext/useNavbarContext';

export type NavbarToggleButtonProps = IconButtonProps;

/**
 * The navbar toggle button.
 */
function NavbarToggleButton(props: NavbarToggleButtonProps) {
	const {
		className = 'h-7 w-7 border border-divider',
		children = <FuseSvgIcon>lucide:panel-left</FuseSvgIcon>,
		...rest
	} = props;

	const { toggleMobileNavbar, toggleNavbar } = useNavbarContext();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { config } = useFuseLayoutSettings();
	const { setSettings } = useFuseSettings();

	return (
		<IconButton
			size="small"
			onClick={() => {
				if (isMobile) {
					toggleMobileNavbar();
				} else if (config?.navbar?.style === 'style-2') {
					setSettings(_.set({}, 'layout.config.navbar.folded', !config?.navbar?.folded));
				} else {
					toggleNavbar();
				}
			}}
			{...rest}
			className={className}
		>
			{children}
		</IconButton>
	);
}

export default NavbarToggleButton;
