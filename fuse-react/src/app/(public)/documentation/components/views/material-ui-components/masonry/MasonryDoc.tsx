// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicMasonryComponent from '../../../ui/material-ui-components/masonry/BasicMasonry';
import BasicMasonryRaw from '../../../ui/material-ui-components/masonry/BasicMasonry.tsx?raw';
import ImageMasonryComponent from '../../../ui/material-ui-components/masonry/ImageMasonry';
import ImageMasonryRaw from '../../../ui/material-ui-components/masonry/ImageMasonry.tsx?raw';
import MasonryWithVariableHeightItemsComponent from '../../../ui/material-ui-components/masonry/MasonryWithVariableHeightItems';
import MasonryWithVariableHeightItemsRaw from '../../../ui/material-ui-components/masonry/MasonryWithVariableHeightItems.tsx?raw';
import FixedColumnsComponent from '../../../ui/material-ui-components/masonry/FixedColumns';
import FixedColumnsRaw from '../../../ui/material-ui-components/masonry/FixedColumns.tsx?raw';
import ResponsiveColumnsComponent from '../../../ui/material-ui-components/masonry/ResponsiveColumns';
import ResponsiveColumnsRaw from '../../../ui/material-ui-components/masonry/ResponsiveColumns.tsx?raw';
import FixedSpacingComponent from '../../../ui/material-ui-components/masonry/FixedSpacing';
import FixedSpacingRaw from '../../../ui/material-ui-components/masonry/FixedSpacing.tsx?raw';
import ResponsiveSpacingComponent from '../../../ui/material-ui-components/masonry/ResponsiveSpacing';
import ResponsiveSpacingRaw from '../../../ui/material-ui-components/masonry/ResponsiveSpacing.tsx?raw';
import SequentialComponent from '../../../ui/material-ui-components/masonry/Sequential';
import SequentialRaw from '../../../ui/material-ui-components/masonry/Sequential.tsx?raw';
import SSRMasonryComponent from '../../../ui/material-ui-components/masonry/SSRMasonry';
import SSRMasonryRaw from '../../../ui/material-ui-components/masonry/SSRMasonry.tsx?raw';

function MasonryDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/masonry"
				target="_blank"
				role="button"
				size="small"
				startIcon={<FuseSvgIcon size={16}>lucide:square-arrow-out-up-right</FuseSvgIcon>}
			>
				Reference
			</Button>
			<Typography
				className="my-4 text-5xl font-bold"
				component="h1"
			>
				Masonry
			</Typography>
			<Typography className="description">
				Masonry lays out contents of varying dimensions as blocks of the same width and different height with
				configurable gaps.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Masonry maintains a list of content blocks with a consistent width but different height. The contents
				are ordered by row. If a row is already filled with the specified number of columns, the next item
				starts another row, and it is added to the shortest column in order to optimize the use of space.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic masonry
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A simple example of a <code>Masonry</code>. <code>Masonry</code> is a container for one or more items.
				It can receive any element including <code>{`<div />`}</code> and <code>{`<img //>`}</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicMasonry.js"
					className="my-4"
					iframe={false}
					component={BasicMasonryComponent}
					raw={BasicMasonryRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Image masonry
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This example demonstrates the use of <code>Masonry</code> for images. <code>Masonry</code> orders its
				children by row. If you&#39;d like to order images by column, check out{' '}
				<a href="/material-ui/react-image-list/#masonry-image-list">ImageList</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ImageMasonry.js"
					className="my-4"
					iframe={false}
					component={ImageMasonryComponent}
					raw={ImageMasonryRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Items with variable height
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This example demonstrates the use of <code>Masonry</code> for items with variable height. Items can move
				to other columns in order to abide by the rule that items are always added to the shortest column and
				hence optimize the use of space.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="MasonryWithVariableHeightItems.js"
					className="my-4"
					iframe={false}
					component={MasonryWithVariableHeightItemsComponent}
					raw={MasonryWithVariableHeightItemsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Columns
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This example demonstrates the use of the <code>columns</code> to configure the number of columns of a{' '}
				<code>Masonry</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FixedColumns.js"
					className="my-4"
					iframe={false}
					component={FixedColumnsComponent}
					raw={FixedColumnsRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<code>columns</code> accepts responsive values:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ResponsiveColumns.js"
					className="my-4"
					iframe={false}
					component={ResponsiveColumnsComponent}
					raw={ResponsiveColumnsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Spacing
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This example demonstrates the use of the <code>spacing</code> to configure the spacing between items. It
				is important to note that the value provided to the <code>spacing</code> prop is multiplied by the
				theme&#39;s spacing field.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FixedSpacing.js"
					className="my-4"
					iframe={false}
					component={FixedSpacingComponent}
					raw={FixedSpacingRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<code>spacing</code> accepts responsive values:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ResponsiveSpacing.js"
					className="my-4"
					iframe={false}
					component={ResponsiveSpacingComponent}
					raw={ResponsiveSpacingRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Sequential
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This example demonstrates the use of the <code>sequential</code> to configure the sequential order. With{' '}
				<code>sequential</code> enabled, items are added in order from left to right rather than adding to the
				shortest column.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Sequential.js"
					className="my-4"
					iframe={false}
					component={SequentialComponent}
					raw={SequentialRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Server-side rendering
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This example demonstrates the use of the <code>defaultHeight</code>, <code>defaultColumns</code> and{' '}
				<code>defaultSpacing</code>, which are used to support server-side rendering.
			</Typography>
			<div className="my-3 rounded-xl border-1 p-4">
				<Typography
					className="mb-8 text-base"
					component="div"
				>
					<code>defaultHeight</code> should be large enough to render all rows. Also, it is worth mentioning
					that items are not added to the shortest column in case of server-side rendering.
				</Typography>
			</div>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SSRMasonry.js"
					className="my-4"
					iframe={false}
					component={SSRMasonryComponent}
					raw={SSRMasonryRaw}
				/>
			</Typography>
		</>
	);
}

export default MasonryDoc;
