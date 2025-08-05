import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Order } from '../../api/types';

/**
 * The order model.
 */
const OrderModel = (data: PartialDeep<Order>): Order =>
	_.defaults(data || {}, {
		id: _.uniqueId('order-'),
		reference: '',
		subtotal: '',
		tax: '',
		discount: '',
		total: '',
		date: '',
		customer: {
			id: null,
			firstName: '',
			lastName: '',
			avatar: '',
			company: '',
			jobTitle: '',
			email: '',
			phone: '',
			invoiceAddress: {
				address: '',
				lat: null,
				lng: null
			},
			shippingAddress: {
				address: '',
				lat: null,
				lng: null
			}
		},
		products: [],
		status: [],
		payment: { transactionId: '', amount: '', method: '', date: '' },
		shippingDetails: []
	});

export default OrderModel;
