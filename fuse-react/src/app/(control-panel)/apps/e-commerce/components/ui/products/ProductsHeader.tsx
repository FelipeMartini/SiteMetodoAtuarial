import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import PageBreadcrumb from 'src/components/PageBreadcrumb';

/**
 * The products header.
 */
function ProductsHeader() {
	return (
		<div className="flex flex-auto flex-col py-4">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					<motion.span
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
					>
						<Typography className="text-4xl leading-none font-extrabold tracking-tight">
							Products
						</Typography>
					</motion.span>

					<div className="flex flex-1 items-center justify-end gap-2">
						<motion.div
							className="flex grow-0"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
						>
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to="/apps/e-commerce/products/new"
								startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
							>
								Add
							</Button>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductsHeader;
