import { useNavbarTheme } from '@fuse/core/FuseSettings/hooks/fuseThemeHooks';
import FuseTheme from '@fuse/core/FuseTheme';

type NavbarThemeProps = {
	children: React.ReactNode;
};

function NavbarTheme({ children }: NavbarThemeProps) {
	const navbarTheme = useNavbarTheme();

	return <FuseTheme theme={navbarTheme}>{children}</FuseTheme>;
}

export default NavbarTheme;
