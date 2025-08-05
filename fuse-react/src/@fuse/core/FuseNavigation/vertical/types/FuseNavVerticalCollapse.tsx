'use client';
import Collapse from '@mui/material/Collapse';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import isUrlInChildren from '@fuse/core/FuseNavigation/isUrlInChildren';
import usePathname from '@fuse/hooks/usePathname';
import FuseNavItem, { FuseNavItemComponentProps } from '../../FuseNavItem';
import FuseNavVerticalItemBase from '../shared/FuseNavVerticalItemBase';
import { FuseNavItemType } from '../../types/FuseNavItemType';

function needsToBeOpened(pathname: string, item: FuseNavItemType) {
	return pathname && isUrlInChildren(item, pathname);
}

/**
 * FuseNavVerticalCollapse component used for vertical navigation items with collapsible children.
 */
function FuseNavVerticalCollapse(props: FuseNavItemComponentProps) {
	const pathname = usePathname();
	const { item, nestedLevel = 0, onItemClick, checkPermission } = props;
	const [open, setOpen] = useState(() => needsToBeOpened(pathname, item));

	const memoizedContent = useMemo(
		() => (
			<>
				<FuseNavVerticalItemBase
					item={item}
					nestedLevel={nestedLevel}
					onItemClick={() => setOpen(!open)}
					className={clsx('fuse-list-item', open && 'open')}
				/>

				{item.children && (
					<Collapse
						in={open}
						className="collapse-children"
					>
						{item.children.map((_item) => (
							<FuseNavItem
								key={_item.id}
								type={`vertical-${_item.type}`}
								item={_item}
								nestedLevel={nestedLevel + 1}
								onItemClick={onItemClick}
								checkPermission={checkPermission}
							/>
						))}
					</Collapse>
				)}
			</>
		),
		[checkPermission, item, nestedLevel, onItemClick, open]
	);

	if (checkPermission && !item?.hasPermission) {
		return null;
	}

	return memoizedContent;
}

const NavVerticalCollapse = FuseNavVerticalCollapse;

export default NavVerticalCollapse;
