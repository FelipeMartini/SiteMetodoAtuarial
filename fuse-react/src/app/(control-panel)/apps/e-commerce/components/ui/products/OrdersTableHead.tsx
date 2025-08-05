import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { useState, MouseEvent, ChangeEvent } from 'react';
import TableHead from '@mui/material/TableHead';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { darken, lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useDeleteOrders } from '../../../api/hooks/orders/useDeleteOrders';

/**
 * The row type.
 */
type rowType = {
	id: string;
	align: 'left' | 'center' | 'right';
	disablePadding: boolean;
	label: string;
	sort: boolean;
};

/**
 * The rows.
 */
const rows: rowType[] = [
	{
		id: 'id',
		align: 'left',
		disablePadding: false,
		label: 'ID',
		sort: true
	},
	{
		id: 'reference',
		align: 'left',
		disablePadding: false,
		label: 'Reference',
		sort: true
	},
	{
		id: 'customer',
		align: 'left',
		disablePadding: false,
		label: 'Customer',
		sort: true
	},
	{
		id: 'total',
		align: 'right',
		disablePadding: false,
		label: 'Total',
		sort: true
	},
	{
		id: 'payment',
		align: 'left',
		disablePadding: false,
		label: 'Payment',
		sort: true
	},
	{
		id: 'status',
		align: 'left',
		disablePadding: false,
		label: 'Status',
		sort: true
	},
	{
		id: 'date',
		align: 'left',
		disablePadding: false,
		label: 'Date',
		sort: true
	}
];

type OrdersTableHeadProps = {
	onRequestSort: (event: MouseEvent<HTMLSpanElement>, property: string) => void;
	onSelectAllClick: (event: ChangeEvent<HTMLInputElement>) => void;
	tableOrder: {
		direction: 'asc' | 'desc';
		id: string;
	};
	selectedOrderIds: string[];
	rowCount: number;
	onMenuItemClick: () => void;
};

/**
 * The orders table head.
 */
function OrdersTableHead(props: OrdersTableHeadProps) {
	const { selectedOrderIds, onRequestSort, onSelectAllClick, tableOrder, rowCount, onMenuItemClick } = props;
	const numSelected = selectedOrderIds.length;

	const [selectedOrdersMenu, setSelectedOrdersMenu] = useState<HTMLButtonElement | null>(null);

	const { mutate: deleteOrders } = useDeleteOrders();

	const createSortHandler = (event: MouseEvent<HTMLSpanElement>, property: string) => {
		onRequestSort(event, property);
	};

	function openSelectedOrdersMenu(event: MouseEvent<HTMLButtonElement>) {
		setSelectedOrdersMenu(event.currentTarget);
	}

	function closeSelectedOrdersMenu() {
		setSelectedOrdersMenu(null);
	}

	// const {onSelectAllClick, order, orderBy, numSelected, rowCount} = props;

	return (
		<TableHead>
			<TableRow className="h-12 sm:h-16">
				<TableCell
					padding="none"
					className="z-99 w-9 text-center md:w-16"
					sx={{
						backgroundColor: (theme) =>
							darken(theme.palette.background.paper, theme.palette.mode === 'light' ? 0.02 : 0.2)
					}}
				>
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount !== 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
					/>
					{numSelected > 0 && (
						<Box
							className="absolute top-0 z-10 mx-14 flex h-16 w-16 items-center justify-center border-b-1 ltr:left-0 rtl:right-0"
							sx={(theme) => ({
								backgroundColor: lighten(theme.palette.background.default, 0.02),
								...theme.applyStyles('light', {
									backgroundColor: lighten(theme.palette.background.default, 0.4)
								})
							})}
						>
							<IconButton
								aria-haspopup="true"
								onClick={openSelectedOrdersMenu}
							>
								<FuseSvgIcon>lucide:align-center-horizontal</FuseSvgIcon>
							</IconButton>
							<Menu
								id="selectedOrdersMenu"
								anchorEl={selectedOrdersMenu}
								open={Boolean(selectedOrdersMenu)}
								onClose={closeSelectedOrdersMenu}
							>
								<MenuList>
									<MenuItem
										onClick={() => {
											deleteOrders(selectedOrderIds);
											onMenuItemClick();
											closeSelectedOrdersMenu();
										}}
									>
										<ListItemIcon className="min-w-9">
											<FuseSvgIcon>lucide:trash</FuseSvgIcon>
										</ListItemIcon>
										<ListItemText primary="Remove" />
									</MenuItem>
								</MenuList>
							</Menu>
						</Box>
					)}
				</TableCell>
				{rows.map((row) => {
					return (
						<TableCell
							sx={(theme) => ({
								backgroundColor: lighten(theme.palette.background.default, 0.02),
								...theme.applyStyles('light', {
									backgroundColor: lighten(theme.palette.background.default, 0.4)
								})
							})}
							className="p-1 md:p-4"
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'normal'}
							sortDirection={tableOrder.id === row.id ? tableOrder.direction : false}
						>
							{row.sort && (
								<Tooltip
									title="Sort"
									placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={tableOrder.id === row.id}
										direction={tableOrder.direction}
										onClick={(ev: MouseEvent<HTMLSpanElement>) => createSortHandler(ev, row.id)}
										className="font-semibold"
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							)}
						</TableCell>
					);
				})}
			</TableRow>
		</TableHead>
	);
}

export default OrdersTableHead;
