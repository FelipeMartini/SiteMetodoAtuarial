import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';

/**
 * The orders header.
 */
function OrdersHeader() {
	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					<motion.span
						initial={{ x: -20 }}
						animate={{
							x: 0,
							transition: { delay: 0.2 }
						}}
					>
						<Typography className="flex text-4xl leading-none font-extrabold tracking-tight">
							Orders
						</Typography>
					</motion.span>
				</div>
			</div>
		</div>
	);
}

export default OrdersHeader;
