'use client';
import { useMemo } from 'react';
import FuseNavItem, { FuseNavItemComponentProps } from '../../FuseNavItem';
import FuseNavVerticalItemBase from '../shared/FuseNavVerticalItemBase';

/**
 * FuseNavVerticalGroup is a component used to render a group of navigation items in a vertical layout.
 */
function FuseNavVerticalGroup(props: FuseNavItemComponentProps) {
	const { item, nestedLevel = 0, onItemClick, checkPermission } = props;

	const memoizedContent = useMemo(
		() => (
			<>
				<FuseNavVerticalItemBase
					className={`fuse-list-subheader mt-4 ${!item.url ? 'cursor-default' : ''}`}
					item={item}
					nestedLevel={nestedLevel}
					onItemClick={onItemClick}
					showIcon={false}
					primaryTitleProps={{
						className: 'fuse-list-subheader-text font-medium',
						color: 'secondary'
					}}
					subtitleProps={{
						className: 'fuse-list-subheader-text-secondary font-medium'
					}}
				/>

				{item?.children?.map((_item) => (
					<FuseNavItem
						key={_item.id}
						type={`vertical-${_item.type}`}
						item={_item}
						nestedLevel={nestedLevel}
						onItemClick={onItemClick}
						checkPermission={checkPermission}
					/>
				))}
			</>
		),
		[checkPermission, item, nestedLevel, onItemClick]
	);

	if (checkPermission && !item?.hasPermission) {
		return null;
	}

	return memoizedContent;
}

const NavVerticalGroup = FuseNavVerticalGroup;

export default NavVerticalGroup;
