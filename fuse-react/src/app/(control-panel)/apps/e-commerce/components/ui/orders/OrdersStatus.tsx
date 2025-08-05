import _ from 'lodash';
import clsx from 'clsx';
import orderStatuses from '../../../lib/constants/orders/orderStatuses';

/**
 * The orders status properties.
 */
type OrdersStatusProps = {
	name: string;
};

/**
 * The orders status component.
 */
function OrdersStatus(props: OrdersStatusProps) {
	const { name } = props;

	return (
		<div
			className={clsx(
				'inline truncate rounded-sm px-2 py-1 text-sm font-medium',
				_.find(orderStatuses, { name })?.color
			)}
		>
			{name}
		</div>
	);
}

export default OrdersStatus;
