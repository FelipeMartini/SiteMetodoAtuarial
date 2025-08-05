'use client';
import { useMemo } from 'react';
import { FuseNavItemComponentProps } from '../../FuseNavItem';
import FuseNavVerticalItemBase from '../shared/FuseNavVerticalItemBase';

/**
 * FuseNavVerticalLink
 * Create a vertical Link to use inside the navigation component.
 */
function FuseNavVerticalLink(props: FuseNavItemComponentProps) {
	const { item, nestedLevel = 0, onItemClick, checkPermission } = props;

	const memoizedContent = useMemo(
		() => (
			<FuseNavVerticalItemBase
				item={item}
				nestedLevel={nestedLevel}
				onItemClick={onItemClick}
			/>
		),
		[item, nestedLevel, onItemClick]
	);

	if (checkPermission && !item?.hasPermission) {
		return null;
	}

	return memoizedContent;
}

const NavVerticalLink = FuseNavVerticalLink;

export default NavVerticalLink;
