import clsx from 'clsx';
import { FuseNavigationProps } from '../FuseNavigation';
import { FuseNavItemType } from '../types/FuseNavItemType';
import FuseNavVerticalItemBase from './shared/FuseNavVerticalItemBase';

/**
 * FuseNavVerticalLayout1
 * This component is used to render vertical navigations using
 * the Material-UI List component. It accepts the FuseNavigationProps props
 * and renders the FuseNavItem components accordingly
 */
function FuseNavVerticalLayout1(props: FuseNavigationProps) {
	const { navigation, active, dense, className, onItemClick, checkPermission } = props;

	function handleItemClick(item: FuseNavItemType) {
		onItemClick?.(item);
	}

	return (
		<div className={clsx('navigation px-3', `active-${active}-list`, dense && 'dense', className)}>
			{navigation.map((_item) => (
				<FuseNavVerticalItemBase
					key={_item.id}
					item={_item}
					nestedLevel={0}
					onItemClick={handleItemClick}
					checkPermission={checkPermission}
					dense={dense}
				/>
			))}
		</div>
	);
}

export default FuseNavVerticalLayout1;
