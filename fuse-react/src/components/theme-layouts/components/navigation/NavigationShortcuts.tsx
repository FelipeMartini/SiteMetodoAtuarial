'use client';
import FuseShortcuts from '@fuse/core/FuseShortcuts';
import { usePrevious } from '@fuse/hooks';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { User } from '@auth/user';
import useUser from '@auth/useUser';
import setIn from '@/utils/setIn';
import useNavigationItems from './hooks/useNavigationItems';

type NavigationShortcutsProps = {
	className?: string;
	variant?: 'horizontal' | 'vertical';
};

/**
 * The navigation shortcuts.
 */
function NavigationShortcuts(props: NavigationShortcutsProps) {
	const { variant, className } = props;
	const { flattenData: navigation } = useNavigationItems();
	const { data: user, updateUser, isGuest } = useUser();
	const [userShortcuts, setUserShortcuts] = useState<string[]>(user?.shortcuts || []);
	const prevUserShortcuts = usePrevious(userShortcuts);

	useEffect(() => {
		if (!isGuest && prevUserShortcuts && !_.isEqual(userShortcuts, prevUserShortcuts)) {
			updateUser(setIn(user, 'shortcuts', userShortcuts) as User);
		}
	}, [isGuest, prevUserShortcuts, updateUser, user, userShortcuts]);

	function handleShortcutsChange(newShortcuts: string[]) {
		setUserShortcuts(newShortcuts);
	}

	return (
		<FuseShortcuts
			className={className}
			variant={variant}
			navigation={navigation}
			shortcuts={userShortcuts}
			onChange={handleShortcutsChange}
		/>
	);
}

export default NavigationShortcuts;
