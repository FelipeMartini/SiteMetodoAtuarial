import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { format } from 'date-fns/format';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import FuseLoading from '@fuse/core/FuseLoading';
import RecentTransactionsWidgetType from '../../../api/types/RecentTransactionsWidgetType';
import { useGetWidget } from '../../../api/hooks/widgets/useGetWidget';

/**
 * The RecentTransactionsWidget widget.
 */
function RecentTransactionsWidget() {
	const { data: widget, isLoading } = useGetWidget<RecentTransactionsWidgetType>('recentTransactions');

	const columns = widget?.columns;
	const rows = widget?.rows;

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	return (
		<Paper className="flex flex-auto flex-col overflow-hidden rounded-xl p-6 shadow-sm">
			<div>
				<Typography className="truncate text-lg leading-6 font-medium tracking-tight">
					Recent transactions
				</Typography>
				<Typography
					className="font-medium"
					color="text.secondary"
				>
					1 pending, 4 completed
				</Typography>
			</div>

			<div className="table-responsive mt-6">
				<Table className="simple table w-full min-w-full">
					<TableHead>
						<TableRow>
							{columns.map((column, index) => (
								<TableCell key={index}>
									<Typography
										color="text.secondary"
										className="text-md font-semibold whitespace-nowrap"
									>
										{column}
									</Typography>
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{rows.map((row, index) => (
							<TableRow key={index}>
								{Object.entries(row).map(([key, value]) => {
									switch (key) {
										case 'id': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography color="text.secondary">{value}</Typography>
												</TableCell>
											);
										}
										case 'date': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography>{format(new Date(value), 'MMM dd, y')}</Typography>
												</TableCell>
											);
										}
										case 'amount': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography>
														{value.toLocaleString('en-US', {
															style: 'currency',
															currency: 'USD'
														})}
													</Typography>
												</TableCell>
											);
										}
										case 'status': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography
														className={clsx(
															'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase',
															value === 'pending' &&
																'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50',
															value === 'completed' &&
																'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50'
														)}
													>
														{value}
													</Typography>
												</TableCell>
											);
										}
										default: {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography>{value}</Typography>
												</TableCell>
											);
										}
									}
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
				<div className="pt-6">
					<Button variant="outlined">See all transactions</Button>
				</div>
			</div>
		</Paper>
	);
}

export default memo(RecentTransactionsWidget);
