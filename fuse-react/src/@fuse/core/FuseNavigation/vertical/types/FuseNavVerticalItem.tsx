'use client';
import { useMemo } from 'react';
import { FuseNavItemComponentProps } from '../../FuseNavItem';
import FuseNavVerticalItemBase from '../shared/FuseNavVerticalItemBase';

/**
 * FuseNavVerticalItem is a React component used to render FuseNavItem as part of the Fuse navigational component.
 */
function FuseNavVerticalItem(props: FuseNavItemComponentProps) {
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

const NavVerticalItem = FuseNavVerticalItem;

export default NavVerticalItem;
