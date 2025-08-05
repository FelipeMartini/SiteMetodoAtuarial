import * as React from 'react';
import FuseTheme from '@fuse/core/FuseTheme';
import { useMainTheme } from '@fuse/core/FuseSettings/hooks/fuseThemeHooks';

type MainThemeProviderProps = {
	children: React.ReactNode;
};

function MainThemeProvider({ children }: MainThemeProviderProps) {
	const mainTheme = useMainTheme();

	return (
		<FuseTheme
			theme={mainTheme}
			root
		>
			{children}
		</FuseTheme>
	);
}

export default MainThemeProvider;
