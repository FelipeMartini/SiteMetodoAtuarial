import * as React from 'react';
import { createTheme, useTheme } from '@mui/material/styles';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import GlobalStyles from '@mui/material/GlobalStyles';
import { StyleSheetManager } from 'styled-components';
import { ReactElement } from 'react';

type FramedDemoProps = {
	document: Document;
	children: ReactElement<{ window?: () => Window }>;
	isolated?: boolean;
};

/**
 * Renders document wrapped with emotion and styling-components cache providers, and proper direction for rtl theme.
 * This also add window property to the child with `getWindow` function, which is useful to fetch window property.
 */
function FramedDemo(props: FramedDemoProps) {
	const { children, document, isolated = false } = props;

	const theme = useTheme();
	React.useEffect(() => {
		document.body.dir = theme.direction;
	}, [document, theme.direction]);

	const cache = React.useMemo(
		() =>
			createCache({
				key: `iframe-demo-${theme.direction}`,
				prepend: true,
				container: document.head,
				stylisPlugins: theme.direction === 'rtl' ? [rtlPlugin] : []
			}),
		[document, theme.direction]
	);

	const getWindow = React.useCallback(() => document.defaultView, [document]);

	const iframeTheme = React.useMemo(() => {
		if (isolated) {
			return null;
		}

		return createTheme({
			colorSchemes: { light: true, dark: true },
			cssVariables: {
				colorSchemeSelector: 'data-mui-color-scheme'
			}
		});
	}, [isolated]);

	return (
		<StyleSheetManager
			target={document.head}
			stylisPlugins={theme.direction === 'rtl' ? [rtlPlugin] : []}
		>
			<CacheProvider value={cache}>
				{iframeTheme && <GlobalStyles styles={iframeTheme.generateStyleSheets?.() || []} />}
				{React.cloneElement(children, {
					window: getWindow
				})}
			</CacheProvider>
		</StyleSheetManager>
	);
}

export default FramedDemo;
