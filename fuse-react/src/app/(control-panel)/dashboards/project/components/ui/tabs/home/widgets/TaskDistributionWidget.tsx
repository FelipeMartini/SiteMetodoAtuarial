import Paper from '@mui/material/Paper';
import { lighten, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { ApexOptions } from 'apexcharts';
import FuseLoading from '@fuse/core/FuseLoading';
import { Tabs, Tab } from '@mui/material';
import TaskDistributionDataType from '../../../../../api/types/home/TaskDistributionDataType';
import { useGetWidget } from '../../../../../api/hooks/widgets/useGetWidget';
import ReactApexChart from 'react-apexcharts';

/**
 * The TaskDistributionWidget widget.
 */
function TaskDistributionWidget() {
	const { data: widget, isLoading } = useGetWidget<TaskDistributionDataType>('taskDistribution');

	const overview = widget?.overview;
	const series = widget?.series || [];
	const labels = widget?.labels;
	const ranges = widget?.ranges || [];

	const [tabValue, setTabValue] = useState(0);
	const currentRange = Object.keys(ranges || {})[tabValue];
	const [awaitRender, setAwaitRender] = useState(true);
	const theme = useTheme();

	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	const chartOptions: ApexOptions = {
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'polarArea',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			}
		},
		labels,
		legend: {
			position: 'bottom'
		},
		plotOptions: {
			polarArea: {
				spokes: {
					connectorColors: theme.palette.divider
				},
				rings: {
					strokeColor: theme.palette.divider
				}
			}
		},
		states: {
			hover: {
				filter: {
					type: 'darken'
				}
			}
		},
		stroke: {
			width: 2
		},
		theme: {
			monochrome: {
				enabled: true,
				color: theme.palette.secondary.main,
				shadeIntensity: 0.75,
				shadeTo: 'dark'
			}
		},
		tooltip: {
			followCursor: true,
			theme: 'dark'
		},
		yaxis: {
			labels: {
				style: {
					colors: theme.palette.text.secondary
				}
			}
		}
	};

	if (awaitRender) {
		return null;
	}

	return (
		<Paper className="flex h-full flex-auto flex-col overflow-hidden rounded-xl p-6 shadow-sm">
			<div className="flex flex-col items-start justify-between sm:flex-row">
				<Typography className="truncate text-lg leading-6 font-medium tracking-tight">
					Task Distribution
				</Typography>
				<div className="mt-0.75 sm:mt-0">
					<Tabs
						value={tabValue}
						onChange={(ev, value: number) => setTabValue(value)}
					>
						{Object.entries(ranges).map(([key, label], index) => (
							<Tab
								key={key}
								value={index}
								label={label}
							/>
						))}
					</Tabs>
				</div>
			</div>
			<div className="mt-1.5 flex flex-auto flex-col">
				<ReactApexChart
					className="w-full flex-auto"
					options={chartOptions}
					series={series[currentRange]}
					type={chartOptions?.chart?.type}
				/>
			</div>
			<Box
				sx={[
					(_theme) =>
						_theme.palette.mode === 'light'
							? {
									backgroundColor: lighten(theme.palette.background.default, 0.4)
								}
							: {
									backgroundColor: lighten(theme.palette.background.default, 0.02)
								}
				]}
				className="-m-6 mt-4 grid grid-cols-2 divide-x border-t"
			>
				<div className="flex flex-col items-center justify-center p-6 sm:p-8">
					<div className="text-5xl leading-none font-semibold tracking-tighter">
						{overview[currentRange].new}
					</div>
					<Typography className="text-secondary mt-1 text-center">New tasks</Typography>
				</div>
				<div className="flex flex-col items-center justify-center p-1.5 sm:p-2">
					<div className="text-5xl leading-none font-semibold tracking-tighter">
						{overview[currentRange].completed}
					</div>
					<Typography className="text-secondary mt-1 text-center">Completed tasks</Typography>
				</div>
			</Box>
		</Paper>
	);
}

export default memo(TaskDistributionWidget);
