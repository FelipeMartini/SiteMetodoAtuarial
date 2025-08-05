'use client';

import { ReactNode } from 'react';
import { ScrumboardAppContextProvider } from '../../contexts/ScrumboardAppContext/ScrumboardAppContextProvider';

type ScrumboardAppProps = {
	children?: ReactNode;
};

/**
 * The scrumboard app.
 */
function ScrumboardApp(props: ScrumboardAppProps) {
	const { children } = props;
	return <ScrumboardAppContextProvider>{children}</ScrumboardAppContextProvider>;
}

export default ScrumboardApp;
