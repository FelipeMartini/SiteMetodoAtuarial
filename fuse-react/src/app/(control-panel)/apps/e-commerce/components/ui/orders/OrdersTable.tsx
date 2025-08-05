import { useMemo } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import { ListItemIcon, MenuItem, Paper } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import FuseLoading from '@fuse/core/FuseLoading';
import { Order } from '../../../api/types';
import { useDeleteOrders } from '../../../api/hooks/orders/useDeleteOrders';
import { useOrders } from '../../../api/hooks/orders/useOrders';
import OrdersStatus from './OrdersStatus';

function OrdersTable() {
	const { data: orders, isLoading } = useOrders();
	const { mutate: deleteOrders } = useDeleteOrders();

	const columns = useMemo<MRT_ColumnDef<Order>[]>(
		() => [
			{
				accessorKey: 'reference',
				header: 'Reference',
				size: 64,
				Cell: ({ row }) => (
					<Typography
						component={Link}
						to={`/apps/e-commerce/orders/${row.original.id}`}
						role="button"
					>
						<u>{row.original.reference}</u>
					</Typography>
				)
			},
			{
				id: 'customer',
				accessorFn: (row) => `${row.customer.firstName} ${row.customer.lastName}`,
				header: 'Customer'
			},
			{
				id: 'total',
				accessorFn: (row) => `$${row.total}`,
				header: 'Total',
				size: 64
			},
			{ id: 'payment', accessorFn: (row) => row.payment.method, header: 'Payment', size: 128 },
			{
				id: 'status',
				accessorFn: (row) => <OrdersStatus name={row.status[0].name} />,
				accessorKey: 'status',
				header: 'Status'
			},
			{
				accessorKey: 'date',
				header: 'Date'
			}
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="shadow-1 flex h-full w-full flex-auto flex-col overflow-hidden rounded-t-lg rounded-b-none"
			elevation={0}
		>
			<DataTable
				data={orders}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							deleteOrders([row.original.id]);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>lucide:trash</FuseSvgIcon>
						</ListItemIcon>
						Delete
					</MenuItem>
				]}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();

					if (Object.keys(rowSelection).length === 0) {
						return null;
					}

					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								deleteOrders(selectedRows.map((row) => row.original.id));
								table.resetRowSelection();
							}}
							className="flex min-w-9 shrink ltr:mr-2 rtl:ml-2"
							color="secondary"
						>
							<FuseSvgIcon>lucide:trash</FuseSvgIcon>
							<span className="mx-2 hidden sm:flex">Delete selected items</span>
						</Button>
					);
				}}
			/>
		</Paper>
	);
}

export default OrdersTable;
