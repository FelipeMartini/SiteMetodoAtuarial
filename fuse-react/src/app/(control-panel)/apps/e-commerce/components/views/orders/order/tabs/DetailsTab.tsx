import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useParams from '@fuse/hooks/useParams';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import { useOrder } from '../../../../../api/hooks/orders/useOrder';
import OrdersStatus from '../../../../ui/orders/OrdersStatus';
import GoogleAddressMap from '../../../../ui/orders/GoogleAddressMap';

/**
 * The order details tab.
 */
function DetailsTab() {
	const routeParams = useParams();

	const { orderId } = routeParams as { orderId: string };

	const { data: order, isError } = useOrder(orderId);

	const [map, setMap] = useState<string>('shipping');

	if (!isError && !order) {
		return null;
	}

	return (
		<div className="flex w-full max-w-5xl flex-col gap-8 md:gap-16">
			<div className="flex flex-col items-start gap-4">
				<div className="flex w-full items-center gap-1">
					<FuseSvgIcon
						color="action"
						size={20}
					>
						lucide:circle-user
					</FuseSvgIcon>
					<Typography
						className="text-xl"
						color="text.secondary"
					>
						Customer
					</Typography>
				</div>

				<div className="flex w-full flex-col gap-4">
					<div className="table-responsive rounded-md border">
						<table className="dense simple table">
							<thead>
								<tr>
									<th>
										<Typography className="font-semibold">Name</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Email</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Phone</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Company</Typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<div className="flex items-center">
											<Avatar src={order.customer.avatar} />
											<Typography className="mx-2 truncate">
												{`${order.customer.firstName} ${order.customer.lastName}`}
											</Typography>
										</div>
									</td>
									<td>
										<Typography className="truncate">{order.customer.email}</Typography>
									</td>
									<td>
										<Typography className="truncate">{order.customer.phone}</Typography>
									</td>
									<td>
										<span className="truncate">{order.customer.company}</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="">
						<Accordion
							expanded={map === 'shipping'}
							onChange={() => setMap(map !== 'shipping' ? 'shipping' : '')}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>Shipping Address</AccordionSummary>
							<AccordionDetails className="flex flex-col md:flex-row">
								<Typography className="mx-2 mb-4 w-full text-lg md:mb-0 md:max-w-64">
									{order.customer.shippingAddress.address}
								</Typography>
								<div className="mx-2 h-80 w-full overflow-hidden rounded-xl">
									<GoogleAddressMap
										center={{
											lng: order.customer.shippingAddress.lng,
											lat: order.customer.shippingAddress.lat
										}}
									/>
								</div>
							</AccordionDetails>
						</Accordion>

						<Accordion
							expanded={map === 'invoice'}
							onChange={() => setMap(map !== 'invoice' ? 'invoice' : '')}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>Invoice Address</AccordionSummary>
							<AccordionDetails className="-mx-2 flex flex-col md:flex-row">
								<Typography className="mx-2 mb-4 w-full text-lg md:mb-0 md:max-w-64">
									{order.customer.invoiceAddress.address}
								</Typography>
								<div className="mx-2 h-80 w-full overflow-hidden rounded-xl">
									<GoogleAddressMap
										center={{
											lng: order.customer.invoiceAddress.lng,
											lat: order.customer.invoiceAddress.lat
										}}
									/>
								</div>
							</AccordionDetails>
						</Accordion>
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex w-full items-center gap-1">
					<FuseSvgIcon
						color="action"
						size={20}
					>
						lucide:clock
					</FuseSvgIcon>
					<Typography
						className="text-xl"
						color="text.secondary"
					>
						Order Status
					</Typography>
				</div>

				<div className="table-responsive rounded-md border">
					<Table className="simple">
						<TableHead>
							<TableRow>
								<TableCell>
									<Typography className="font-semibold">Status</Typography>
								</TableCell>
								<TableCell>
									<Typography className="font-semibold">Updated On</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{order.status.map((status) => (
								<TableRow key={status.id}>
									<TableCell>
										<OrdersStatus name={status.name} />
									</TableCell>
									<TableCell>{status.date}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex w-full items-center gap-1">
					<FuseSvgIcon
						color="action"
						size={20}
					>
						lucide:dollar-sign
					</FuseSvgIcon>
					<Typography
						className="text-xl"
						color="text.secondary"
					>
						Payment
					</Typography>
				</div>
				<div className="table-responsive rounded-md border">
					<table className="simple">
						<thead>
							<tr>
								<th>
									<Typography className="font-semibold">TransactionID</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Payment Method</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Amount</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Date</Typography>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<span className="truncate">{order.payment.transactionId}</span>
								</td>
								<td>
									<span className="truncate">{order.payment.method}</span>
								</td>
								<td>
									<span className="truncate">{order.payment.amount}</span>
								</td>
								<td>
									<span className="truncate">{order.payment.date}</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex w-full items-center gap-1">
					<FuseSvgIcon
						color="action"
						size={20}
					>
						lucide:truck
					</FuseSvgIcon>
					<Typography
						className="text-xl"
						color="text.secondary"
					>
						Shipping
					</Typography>
				</div>

				<div className="table-responsive rounded-md border">
					<table className="simple dense">
						<thead>
							<tr>
								<th>
									<Typography className="font-semibold">Tracking Code</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Carrier</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Weight</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Fee</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Date</Typography>
								</th>
							</tr>
						</thead>
						<tbody>
							{order.shippingDetails.map((shipping) => (
								<tr key={shipping.date}>
									<td>
										<span className="truncate">{shipping.tracking}</span>
									</td>
									<td>
										<span className="truncate">{shipping.carrier}</span>
									</td>
									<td>
										<span className="truncate">{shipping.weight}</span>
									</td>
									<td>
										<span className="truncate">{shipping.fee}</span>
									</td>
									<td>
										<span className="truncate">{shipping.date}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default DetailsTab;
