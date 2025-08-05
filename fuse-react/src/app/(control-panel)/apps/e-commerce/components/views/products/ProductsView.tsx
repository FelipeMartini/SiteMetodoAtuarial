'use client';

import ProductsHeader from '../../ui/products/ProductsHeader';
import ProductsTable from '../../ui/products/ProductsTable';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageCarded)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

/**
 * The products page.
 */
function Products() {
	return (
		<Root
			header={<ProductsHeader />}
			content={<ProductsTable />}
		/>
	);
}

export default Products;
