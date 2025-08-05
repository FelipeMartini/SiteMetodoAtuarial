'use client';

import FuseExample from '@fuse/core/FuseExample';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import AreaComponent from '../../ui/third-party-components/react-apexcharts-examples/Area';
import AreaRaw from '../../ui/third-party-components/react-apexcharts-examples/Area.tsx?raw';

import BarComponent from '../../ui/third-party-components/react-apexcharts-examples/Bar';
import BarRaw from '../../ui/third-party-components/react-apexcharts-examples/Bar.tsx?raw';

import ColumnComponent from '../../ui/third-party-components/react-apexcharts-examples/Column';
import ColumnRaw from '../../ui/third-party-components/react-apexcharts-examples/Column.tsx?raw';

import DonutComponent from '../../ui/third-party-components/react-apexcharts-examples/Donut';
import DonutRaw from '../../ui/third-party-components/react-apexcharts-examples/Donut.tsx?raw';

import LineComponent from '../../ui/third-party-components/react-apexcharts-examples/Line';
import LineRaw from '../../ui/third-party-components/react-apexcharts-examples/Line.tsx?raw';

import RadialBarComponent from '../../ui/third-party-components/react-apexcharts-examples/RadialBar';
import RadialBarRaw from '../../ui/third-party-components/react-apexcharts-examples/RadialBar.tsx?raw';

/**
 * GoogleMapReact Doc
 * This document provides information on how to use GoogleMapReact.
 */
function ReactApexchartsDoc() {
	return (
		<>
			<div className="mb-6 flex w-full items-center justify-between">
				<Typography variant="h4">react-apexcharts</Typography>
				<Button
					variant="contained"
					color="secondary"
					component="a"
					href="https://github.com/apexcharts/react-apexcharts"
					target="_blank"
					role="button"
					startIcon={<FuseSvgIcon>lucide:external-link</FuseSvgIcon>}
					className="not-prose"
				>
					Reference
				</Button>
			</div>

			<Typography
				className="mb-4"
				component="p"
			>
				React.js wrapper for ApexCharts to build interactive visualizations in react.
			</Typography>

			<hr className="not-prose" />

			<Typography
				className="mt-8 mb-2 text-5xl"
				component="h2"
			>
				Example Usages
			</Typography>

			<FuseExample
				className="mb-16"
				component={AreaComponent}
				raw={AreaRaw}
			/>

			<FuseExample
				className="mb-16"
				component={BarComponent}
				raw={BarRaw}
			/>

			<FuseExample
				className="mb-16"
				component={ColumnComponent}
				raw={ColumnRaw}
			/>

			<FuseExample
				className="mb-16"
				component={DonutComponent}
				raw={DonutRaw}
			/>

			<FuseExample
				className="mb-16"
				component={LineComponent}
				raw={LineRaw}
			/>

			<FuseExample
				className="mb-16"
				component={RadialBarComponent}
				raw={RadialBarRaw}
			/>

			<Typography
				className="mt-8 mb-2 text-5xl"
				component="h2"
			>
				Demos
			</Typography>

			<ul>
				<li className="mb-2">
					<Link to="/dashboards/analytics">Analytics Dashboard</Link>
				</li>
				<li className="mb-2">
					<Link to="/dashboards/project">Project Dashboard</Link>
				</li>
			</ul>
		</>
	);
}

export default ReactApexchartsDoc;
