import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import Chip from '@mui/material/Chip';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetWidget } from '../../../../../api/hooks/widgets/useGetWidget';
import BudgetDetailsDataType from '../../../../../api/types/budget/BudgetDetailsDataType';

/**
 * The BudgetDetailsWidget widget.
 */
function BudgetDetailsWidget() {
	const { data: widget, isLoading } = useGetWidget<BudgetDetailsDataType>('budgetDetails');

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	const { columns, rows } = widget;

	return (
		<Paper className="flex flex-auto flex-col overflow-hidden rounded-xl p-6 shadow-sm">
			<Typography className="truncate text-lg leading-6 font-medium tracking-tight">Budget Details</Typography>

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
										case 'type': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Chip
														size="small"
														label={value}
													/>
												</TableCell>
											);
										}
										case 'total':
										case 'expensesAmount':
										case 'remainingAmount': {
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
										case 'expensesPercentage':
										case 'remainingPercentage': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography>{`${value}%`}</Typography>
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
			</div>
		</Paper>
	);
}

export default memo(BudgetDetailsWidget);
