import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { Order } from '../../../../../api/types';

const Root = styled('div')(({ theme }) => ({
	'& table ': {
		'& th:first-of-type, & td:first-of-type': {
			paddingLeft: `${0}!important`
		},
		'& th:last-child, & td:last-child': {
			paddingRight: `${0}!important`
		}
	},
	'& .divider': {
		width: 1,
		backgroundColor: theme.vars.palette.divider,
		height: 144
	},
	'& .seller': {
		backgroundColor: theme.vars.palette.primary.dark,
		color: theme.palette.getContrastText(theme.palette.primary.dark),
		marginRight: -88,
		paddingRight: 66,
		width: 480,
		'& .divider': {
			backgroundColor: theme.palette.getContrastText(theme.palette.primary.dark),
			opacity: 0.5
		}
	}
}));

type InvoiceTabProps = {
	order: Order;
};

/**
 * The invoice tab.
 */
function InvoiceTab(props: InvoiceTabProps) {
	const { order } = props;

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2
	});

	return (
		<Root className="w-full max-w-7xl shrink-0 grow p-0">
			{order && (
				<Card
					className="mx-auto w-3xl"
					elevation={0}
				>
					<CardContent className="p-22 print:p-0">
						<Typography
							color="text.secondary"
							className="mb-8"
						>
							{order.date}
						</Typography>

						<div className="flex justify-between">
							<div>
								<table className="mb-4">
									<tbody>
										<tr>
											<td className="pb-1">
												<Typography
													className="font-light"
													variant="h6"
													color="text.secondary"
												>
													INVOICE
												</Typography>
											</td>
											<td className="px-2 pb-1">
												<Typography
													className="font-light"
													variant="h6"
													color="inherit"
												>
													{order.reference}
												</Typography>
											</td>
										</tr>
									</tbody>
								</table>

								<Typography color="text.secondary">
									{`${order.customer.firstName} ${order.customer.lastName}`}
								</Typography>

								{order.customer.invoiceAddress.address && (
									<Typography color="text.secondary">
										{order.customer.invoiceAddress.address}
									</Typography>
								)}
								{order.customer.phone && (
									<Typography color="text.secondary">{order.customer.phone}</Typography>
								)}
								{order.customer.email && (
									<Typography color="text.secondary">{order.customer.email}</Typography>
								)}
							</div>

							<div className="seller flex items-center p-4">
								<img
									className="w-20"
									src="/assets/images/logo/logo.svg"
									alt="logo"
								/>

								<div className="divider mx-2 h-24" />

								<div className="px-2">
									<Typography color="inherit">FUSE INC.</Typography>

									<Typography color="inherit">2810 Country Club Road Cranford, NJ 07016</Typography>
									<Typography color="inherit">+66 123 455 87</Typography>
									<Typography color="inherit">hello@fuseinc.com</Typography>
									<Typography color="inherit">www.fuseinc.com</Typography>
								</div>
							</div>
						</div>

						<div className="mt-16">
							<Table className="simple">
								<TableHead>
									<TableRow>
										<TableCell>PRODUCT</TableCell>
										<TableCell>PRICE</TableCell>
										<TableCell align="right">QUANTITY</TableCell>
										<TableCell align="right">TOTAL</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{order?.products?.map((product) => (
										<TableRow key={product.id}>
											<TableCell>
												<Typography variant="subtitle1">{product.name}</Typography>
											</TableCell>
											<TableCell align="right">
												{product.price && formatter.format(+product.price)}
											</TableCell>
											<TableCell align="right">{product.quantity}</TableCell>
											<TableCell align="right">
												{product.price &&
													product.quantity &&
													formatter.format(+product.price * product.quantity)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							<Table className="simple mt-8">
								<TableBody>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												SUBTOTAL
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												{formatter.format(+order.subtotal)}
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												TAX
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												{formatter.format(+order.tax)}
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												DISCOUNT
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												{formatter.format(+order.discount)}
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography
												className="font-light"
												variant="h4"
												color="text.secondary"
											>
												TOTAL
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-light"
												variant="h4"
												color="text.secondary"
											>
												{formatter.format(+order.total)}
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>

						<div className="mt-24">
							<Typography
								className="mb-6 print:mb-3"
								variant="body1"
							>
								Please pay within 15 days. Thank you for your business.
							</Typography>

							<div className="flex">
								<div className="shrink-0">
									<img
										className="w-8"
										src="/assets/images/logo/logo.svg"
										alt="logo"
									/>
								</div>

								<Typography
									className="mb-16 px-6 font-normal"
									variant="caption"
									color="text.secondary"
								>
									In condimentum malesuada efficitur. Mauris volutpat placerat auctor. Ut ac congue
									dolor. Quisque scelerisque lacus sed feugiat fermentum. Cras aliquet facilisis
									pellentesque. Nunc hendrerit quam at leo commodo, a suscipit tellus dapibus. Etiam
									at felis volutpat est mollis lacinia. Mauris placerat sem sit amet velit mollis, in
									porttitor ex finibus. Proin eu nibh id libero tincidunt lacinia et eget eros.
								</Typography>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</Root>
	);
}

export default memo(InvoiceTab);
