'use client';
import OrdersHeader from '../../ui/orders/OrdersHeader';
import OrdersTable from '../../ui/orders/OrdersTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The orders page.
 */
function Orders() {
	return (
		<Root
			header={<OrdersHeader />}
			content={<OrdersTable />}
		/>
	);
}

export default Orders;
