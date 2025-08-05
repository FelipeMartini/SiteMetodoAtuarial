import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ProductView = lazy(() => import('./components/views/products/product/ProductView'));
const ProductsView = lazy(() => import('./components/views/products/ProductsView'));
const OrderView = lazy(() => import('./components/views/orders/order/OrderView'));
const OrdersView = lazy(() => import('./components/views/orders/OrdersView'));

/**
 * The E-Commerce app Routes.
 */
const Route: FuseRouteItemType = {
	path: 'apps/e-commerce',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="products" />
		},
		{
			path: 'products',
			children: [
				{
					path: '',
					element: <ProductsView />
				},
				{
					path: ':productId/:handle?',
					element: <ProductView />
				}
			]
		},
		{
			path: 'orders',
			children: [
				{
					path: '',
					element: <OrdersView />
				},
				{
					path: ':orderId',
					element: <OrderView />
				}
			]
		}
	]
};

export default Route;
