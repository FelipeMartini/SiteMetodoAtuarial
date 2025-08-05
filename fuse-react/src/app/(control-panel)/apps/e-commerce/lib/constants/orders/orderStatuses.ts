import { Order } from '../../../api/types';

/**
 * The order statuses.
 */
const orderStatuses: Order['status'] = [
	{
		id: '1',
		name: 'Awaiting check payment',
		color: 'bg-slate-100 text-slate-700'
	},
	{
		id: '2',
		name: 'Payment accepted',
		color: 'bg-emerald-50 text-emerald-700'
	},
	{
		id: '3',
		name: 'Preparing the order',
		color: 'bg-blue-50 text-blue-700'
	},
	{
		id: '4',
		name: 'Shipped',
		color: 'bg-indigo-50 text-indigo-700'
	},
	{
		id: '5',
		name: 'Delivered',
		color: 'bg-teal-50 text-teal-700'
	},
	{
		id: '6',
		name: 'Canceled',
		color: 'bg-zinc-100 text-zinc-700'
	},
	{
		id: '7',
		name: 'Refunded',
		color: 'bg-rose-50 text-rose-700'
	},
	{
		id: '8',
		name: 'Payment error',
		color: 'bg-red-50 text-red-700'
	},
	{
		id: '9',
		name: 'On pre-order (paid)',
		color: 'bg-purple-50 text-purple-700'
	},
	{
		id: '10',
		name: 'Awaiting bank wire payment',
		color: 'bg-slate-100 text-slate-700'
	},
	{
		id: '11',
		name: 'Awaiting PayPal payment',
		color: 'bg-slate-100 text-slate-700'
	},
	{
		id: '12',
		name: 'Remote payment accepted',
		color: 'bg-emerald-50 text-emerald-700'
	},
	{
		id: '13',
		name: 'On pre-order (not paid)',
		color: 'bg-purple-50 text-purple-600'
	},
	{
		id: '14',
		name: 'Awaiting Cash-on-delivery payment',
		color: 'bg-slate-100 text-slate-700'
	}
];

export default orderStatuses;
