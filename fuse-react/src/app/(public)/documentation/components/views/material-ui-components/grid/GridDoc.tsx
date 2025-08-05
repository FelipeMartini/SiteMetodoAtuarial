// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicGridComponent from '../../../ui/material-ui-components/grid/BasicGrid';
import BasicGridRaw from '../../../ui/material-ui-components/grid/BasicGrid.tsx?raw';
import FullWidthGridComponent from '../../../ui/material-ui-components/grid/FullWidthGrid';
import FullWidthGridRaw from '../../../ui/material-ui-components/grid/FullWidthGrid.tsx?raw';
import SpacingGridComponent from '../../../ui/material-ui-components/grid/SpacingGrid';
import SpacingGridRaw from '../../../ui/material-ui-components/grid/SpacingGrid.tsx?raw';
import RowAndColumnSpacingComponent from '../../../ui/material-ui-components/grid/RowAndColumnSpacing';
import RowAndColumnSpacingRaw from '../../../ui/material-ui-components/grid/RowAndColumnSpacing.tsx?raw';
import ResponsiveGridComponent from '../../../ui/material-ui-components/grid/ResponsiveGrid';
import ResponsiveGridRaw from '../../../ui/material-ui-components/grid/ResponsiveGrid.tsx?raw';
import InteractiveGridComponent from '../../../ui/material-ui-components/grid/InteractiveGrid';
import InteractiveGridRaw from '../../../ui/material-ui-components/grid/InteractiveGrid.tsx?raw';
import AutoGridComponent from '../../../ui/material-ui-components/grid/AutoGrid';
import AutoGridRaw from '../../../ui/material-ui-components/grid/AutoGrid.tsx?raw';
import VariableWidthGridComponent from '../../../ui/material-ui-components/grid/VariableWidthGrid';
import VariableWidthGridRaw from '../../../ui/material-ui-components/grid/VariableWidthGrid.tsx?raw';
import NestedGridComponent from '../../../ui/material-ui-components/grid/NestedGrid';
import NestedGridRaw from '../../../ui/material-ui-components/grid/NestedGrid.tsx?raw';
import NestedGridColumnsComponent from '../../../ui/material-ui-components/grid/NestedGridColumns';
import NestedGridColumnsRaw from '../../../ui/material-ui-components/grid/NestedGridColumns.tsx?raw';
import ColumnsGridComponent from '../../../ui/material-ui-components/grid/ColumnsGrid';
import ColumnsGridRaw from '../../../ui/material-ui-components/grid/ColumnsGrid.tsx?raw';
import OffsetGridComponent from '../../../ui/material-ui-components/grid/OffsetGrid';
import OffsetGridRaw from '../../../ui/material-ui-components/grid/OffsetGrid.tsx?raw';
import CenteredElementGridComponent from '../../../ui/material-ui-components/grid/CenteredElementGrid';
import CenteredElementGridRaw from '../../../ui/material-ui-components/grid/CenteredElementGrid.tsx?raw';
import FullBorderedGridComponent from '../../../ui/material-ui-components/grid/FullBorderedGrid';
import FullBorderedGridRaw from '../../../ui/material-ui-components/grid/FullBorderedGrid.tsx?raw';
import HalfBorderedGridComponent from '../../../ui/material-ui-components/grid/HalfBorderedGrid';
import HalfBorderedGridRaw from '../../../ui/material-ui-components/grid/HalfBorderedGrid.tsx?raw';
import ColumnLayoutInsideGridComponent from '../../../ui/material-ui-components/grid/ColumnLayoutInsideGrid';
import ColumnLayoutInsideGridRaw from '../../../ui/material-ui-components/grid/ColumnLayoutInsideGrid.tsx?raw';

function GridDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/grid"
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
				Grid
			</Typography>
			<Typography className="description">
				The responsive layout grid adapts to screen size and orientation, ensuring consistency across layouts.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>Grid</code> component works well for a layout with a known number of columns. The columns can
				be configured with multiple breakpoints to specify the column span of each child.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				How it works
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The grid system is implemented with the <code>Grid</code> component:
			</Typography>
			<ul className="space-y-4">
				<li>
					It uses <a href="https://www.w3.org/TR/css-flexbox-1/">CSS Flexbox</a> (rather than CSS Grid) for
					high flexibility.
				</li>
				<li>
					The grid is always a flex item. Use the <code>container</code> prop to add a flex container.
				</li>
				<li>
					Item widths are set in percentages, so they&#39;re always fluid and sized relative to their parent
					element.
				</li>
				<li>
					There are five default grid breakpoints: xs, sm, md, lg, and xl. If you need custom breakpoints,
					check out <a href="#custom-breakpoints">custom breakpoints grid</a>.
				</li>
				<li>
					You can give integer values for each breakpoint, to indicate how many of the 12 available columns
					are occupied by the component when the viewport width satisfies the{' '}
					<a href="/material-ui/customization/breakpoints/#default-breakpoints">breakpoint constraints</a>.
				</li>
				<li>
					It uses{' '}
					<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/gap">
						the <code>gap</code> CSS property
					</a>{' '}
					to add spacing between items.
				</li>
				<li>
					It does <em>not</em> support row spanning. Children elements cannot span multiple rows. We recommend
					using <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout">CSS Grid</a> if you
					need this functionality.
				</li>
				<li>
					It does <em>not</em> automatically place children. It will try to fit the children one by one, and
					if there is not enough space, the rest of the children will start on the next line, and so on. If
					you need auto-placement, we recommend using{' '}
					<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Auto-placement_in_grid_layout">
						CSS Grid
					</a>{' '}
					instead.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::warning The <code>Grid</code> component is a <em>layout</em> grid, not a <em>data</em> grid. If you
				need a data grid, check out{' '}
				<a href="/x/react-data-grid/">
					the MUI X <code>DataGrid</code> component
				</a>
				. :::
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Fluid grids
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Fluid grids use columns that scale and resize content. A fluid grid&#39;s layout can use breakpoints to
				determine if the layout needs to change dramatically.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Basic grid
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In order to create a grid layout, you need a container. Use the <code>container</code> prop to create a
				grid container that wraps the grid items (the <code>Grid</code> is always an item).
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Column widths are integer values between 1 and 12. For example, an item with <code>{`size={6}`}</code>{' '}
				occupies half of the grid container&#39;s width.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicGrid.js"
					className="my-4"
					iframe={false}
					component={BasicGridComponent}
					raw={BasicGridRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Multiple breakpoints
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Items may have multiple widths defined, causing the layout to change at the defined breakpoint. Width
				values apply to all wider breakpoints, and larger breakpoints override those given to smaller
				breakpoints.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				For example, a component with <code>{`size={{ xs: 12, sm: 6 }}`}</code> occupies the entire viewport
				width when the viewport is{' '}
				<a href="/material-ui/customization/breakpoints/#default-breakpoints">less than 600 pixels wide</a>.
				When the viewport grows beyond this size, the component occupies half of the total width—six columns
				rather than 12.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FullWidthGrid.js"
					className="my-4"
					iframe={false}
					component={FullWidthGridComponent}
					raw={FullWidthGridRaw}
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
				Use the <code>spacing</code> prop to control the space between children. The spacing value can be any
				positive number (including decimals) or a string. The prop is converted into a CSS property using the{' '}
				<a href="/material-ui/customization/spacing/">
					<code>theme.spacing()</code>
				</a>{' '}
				helper.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The following demo illustrates the use of the <code>spacing</code> prop:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SpacingGrid.js"
					className="my-4"
					iframe={false}
					component={SpacingGridComponent}
					raw={SpacingGridRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Row and column spacing
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>rowSpacing</code> and <code>columnSpacing</code> props let you specify row and column gaps
				independently of one another. They behave similarly to the <code>row-gap</code> and{' '}
				<code>column-gap</code> properties of <a href="/system/grid/#row-gap-amp-column-gap">CSS Grid</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="RowAndColumnSpacing.js"
					className="my-4"
					iframe={false}
					component={RowAndColumnSpacingComponent}
					raw={RowAndColumnSpacingRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Responsive values
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can set prop values to change when a given breakpoint is active. For instance, we can implement
				Material Design&#39;s{' '}
				<a href="https://m2.material.io/design/layout/responsive-layout-grid.html">recommended</a> responsive
				layout grid, as seen in the following demo:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ResponsiveGrid.js"
					className="my-4"
					iframe={false}
					component={ResponsiveGridComponent}
					raw={ResponsiveGridRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Responsive values are supported by:
			</Typography>
			<ul className="space-y-4">
				<li>
					<code>size</code>
				</li>
				<li>
					<code>columns</code>
				</li>
				<li>
					<code>columnSpacing</code>
				</li>
				<li>
					<code>direction</code>
				</li>
				<li>
					<code>rowSpacing</code>
				</li>
				<li>
					<code>spacing</code>
				</li>
				<li>
					<code>offset</code>
				</li>
			</ul>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Interactive
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Below is an interactive demo that lets you explore the visual results of the different settings:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="InteractiveGrid.js"
					className="my-4"
					iframe={false}
					component={InteractiveGridComponent}
					raw={InteractiveGridRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Auto-layout
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The auto-layout feature gives equal space to all items present. When you set the width of one item, the
				others will automatically resize to match it.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="AutoGrid.js"
					className="my-4"
					iframe={false}
					component={AutoGridComponent}
					raw={AutoGridRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Variable width content
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				When a breakpoint&#39;s value is given as <code>{`"auto"`}</code>, then a column&#39;s size will
				automatically adjust to match the width of its content. The demo below shows how this works:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="VariableWidthGrid.js"
					className="my-4"
					iframe={false}
					component={VariableWidthGridComponent}
					raw={VariableWidthGridRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Nested grid
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The grid container that renders as a <strong>direct child</strong> inside another grid container is a
				nested grid that inherits its{' '}
				<a href="#columns">
					<code>columns</code>
				</a>{' '}
				and{' '}
				<a href="#spacing">
					<code>spacing</code>
				</a>{' '}
				from the top level. It will also inherit the props of the top-level grid if it receives those props.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::success
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Note that a nested grid container should be a direct child of another grid container. If there are
				non-grid elements in between, the grid container will start as the new root container.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
<Grid container>
  <Grid container> // A nested grid container that inherits columns and spacing from above.
    <div>
      <Grid container> // A new root grid container with its own variables scope.
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Inheriting spacing
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A nested grid container inherits the row and column spacing from its parent unless the{' '}
				<code>spacing</code> prop is specified to the instance.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="NestedGrid.js"
					className="my-4"
					iframe={false}
					component={NestedGridComponent}
					raw={NestedGridRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Inheriting columns
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A nested grid container inherits the columns from its parent unless the <code>columns</code> prop is
				specified to the instance.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="NestedGridColumns.js"
					className="my-4"
					iframe={false}
					component={NestedGridColumnsComponent}
					raw={NestedGridColumnsRaw}
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
				Use the <code>columns</code> prop to change the default number of columns (12) in the grid, as shown
				below:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ColumnsGrid.js"
					className="my-4"
					iframe={false}
					component={ColumnsGridComponent}
					raw={ColumnsGridRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Offset
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>offset</code> prop pushes an item to the right side of the grid. This props accepts:
			</Typography>
			<ul className="space-y-4">
				<li>
					numbers—for example, <code>{`offset={{ md: 2 }}`}</code> pushes an item two columns to the right
					when the viewport size is equal to or greater than the <code>md</code> breakpoint.
				</li>
				<li>
					<code>{`"auto"`}</code>—this pushes the item to the far right side of the grid container.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The demo below illustrates how to use the offset props:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="OffsetGrid.js"
					className="my-4"
					iframe={false}
					component={OffsetGridComponent}
					raw={OffsetGridRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Custom breakpoints
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you specify custom breakpoints in the theme, you can use those names as grid item props in responsive
				values:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
import { ThemeProvider, createTheme } from '@mui/material/styles';

function Demo() {
  return (
    <ThemeProvider
      theme={createTheme({
        breakpoints: {
          values: {
            laptop: 1024,
            tablet: 640,
            mobile: 0,
            desktop: 1280,
          },
        },
      })}
    >
      <Grid container spacing={{ mobile: 1, tablet: 2, laptop: 3 }}>
        {Array.from(Array(4)).map((_, index) => (
          <Grid key={index} size={{ mobile: 6, tablet: 4, laptop: 3 }}>
            <div>{index + 1}</div>
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
  );
}
`}
			</FuseHighlight>
			<div className="my-3 rounded-xl border-1 p-4">
				<Typography
					className="mb-8 text-base"
					component="div"
				>
					Custom breakpoints affect all <a href="#responsive-values">responsive values</a>.
				</Typography>
			</div>

			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				TypeScript
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You have to set module augmentation on the theme breakpoints interface.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-ts"
			>
				{` 
declare module '@mui/system' {
  interface BreakpointOverrides {
    // Your custom breakpoints
    laptop: true;
    tablet: true;
    mobile: true;
    desktop: true;
    // Remove default breakpoints
    xs: false;
    sm: false;
    md: false;
    lg: false;
    xl: false;
  }
}
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Customization
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Centered elements
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To center a grid item&#39;s content, specify <code>{`display="flex"`}</code> directly on the item. Then
				use <code>justifyContent</code> and/or <code>alignItems</code> to adjust the position of the content, as
				shown below:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CenteredElementGrid.js"
					className="my-4"
					iframe={false}
					component={CenteredElementGridComponent}
					raw={CenteredElementGridRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::warning Using the <code>container</code> prop does not work in this situation because the grid
				container is designed exclusively to wrap grid items. It cannot wrap other elements. :::
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Full border
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FullBorderedGrid.js"
					className="my-4"
					iframe={false}
					component={FullBorderedGridComponent}
					raw={FullBorderedGridRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Half border
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="HalfBorderedGrid.js"
					className="my-4"
					iframe={false}
					component={HalfBorderedGridComponent}
					raw={HalfBorderedGridRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Limitations
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Column direction
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Using <code>{`direction="column"`}</code> or <code>{`direction="column-reverse"`}</code> is not
				supported. The Grid component is specifically designed to subdivide a layout into columns, not rows. You
				should not use the Grid component on its own to stack layout elements vertically. Instead, you should
				use the <a href="/material-ui/react-stack/">Stack component</a> inside of a Grid to create vertical
				layouts as shown below:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ColumnLayoutInsideGrid.js"
					className="my-4"
					iframe={false}
					component={ColumnLayoutInsideGridComponent}
					raw={ColumnLayoutInsideGridRaw}
				/>
			</Typography>
		</>
	);
}

export default GridDoc;
