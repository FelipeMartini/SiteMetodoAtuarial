import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Tooltip } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import _ from 'lodash';
import VisitorsVsPageViewsType from '../../../api/types/VisitorsVsPageViewsType';
import { useGetWidget } from '../../../api/hooks/widgets/useGetWidget';
import ReactApexChart from 'react-apexcharts';

/**
 * Visitors vs. Page Views widget.
 */
function VisitorsVsPageViewsWidget() {
	const theme = useTheme();
	const { data: widget } = useGetWidget<VisitorsVsPageViewsType>('visitorsVsPageViews');

	const series = widget?.series || [];
	const averageRatio = widget?.averageRatio;
	const predictedRatio = widget?.predictedRatio;
	const overallScore = widget?.overallScore;

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'area',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			}
		},
		colors: [theme.palette.primary.light, theme.palette.primary.light],
		dataLabels: {
			enabled: false
		},
		fill: {
			colors: [theme.palette.primary.dark, theme.palette.primary.light],
			opacity: 0.5
		},
		grid: {
			show: false,
			padding: {
				bottom: -40,
				left: 0,
				right: 0
			}
		},
		legend: {
			show: false
		},
		stroke: {
			curve: 'smooth',
			width: 2
		},
		tooltip: {
			followCursor: true,
			theme: 'dark',
			x: {
				format: 'MMM dd, yyyy'
			}
		},
		xaxis: {
			axisBorder: {
				show: false
			},
			labels: {
				offsetY: -20,
				rotate: 0,
				style: {
					colors: theme.palette.text.secondary
				}
			},
			tickAmount: 3,
			tooltip: {
				enabled: false
			},
			type: 'datetime'
		},
		yaxis: {
			labels: {
				style: {
					colors: theme.palette.divider
				}
			},
			max: (max) => max + 250,
			min: (min) => min - 250,
			show: false,
			tickAmount: 5
		}
	};

	if (!widget) {
		return null;
	}

	return (
		<Paper className="flex flex-auto flex-col overflow-hidden rounded-xl shadow-sm">
			<div className="m-6 mb-0 flex items-start justify-between">
				<Typography className="truncate text-xl leading-6 font-medium tracking-tight">
					Visitors vs. Page Views
				</Typography>
				<div className="ml-2">
					<Chip
						size="small"
						className="text-sm font-medium"
						label="30 days"
					/>
				</div>
			</div>
			<div className="mx-6 mt-6 flex items-start">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="flex flex-col">
						<div className="flex items-center">
							<div className="text-secondary leading-5 font-medium">Overall Score</div>
							<Tooltip title="Score is calculated by using the historical ratio between Page Views and Visitors. Best score is 1000, worst score is 0.">
								<FuseSvgIcon
									className="ml-1.5"
									size={16}
									color="disabled"
								>
									lucide:info
								</FuseSvgIcon>
							</Tooltip>
						</div>
						<div className="mt-2 flex items-start">
							<div className="text-4xl leading-none font-bold tracking-tight">{overallScore}</div>
							<div className="ml-2 flex items-center">
								<FuseSvgIcon
									className="text-green-500"
									size={20}
								>
									lucide:trending-up
								</FuseSvgIcon>
								<Typography className="text-md ml-1 font-medium text-green-500">42.9%</Typography>
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex items-center">
							<div className="text-secondary leading-5 font-medium">Average Ratio</div>
							<Tooltip title="Average Ratio is the average ratio between Page Views and Visitors">
								<FuseSvgIcon
									className="ml-1.5"
									size={16}
									color="disabled"
								>
									lucide:trending-up
								</FuseSvgIcon>
							</Tooltip>
						</div>
						<div className="mt-2 flex items-start">
							<div className="text-4xl leading-none font-bold tracking-tight">{averageRatio}%</div>
							<div className="ml-2 flex items-center">
								<FuseSvgIcon
									className="text-red-500"
									size={20}
								>
									lucide:trending-down
								</FuseSvgIcon>
								<Typography className="text-md ml-1 font-medium text-red-500">13.1%</Typography>
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex items-center">
							<div className="text-secondary leading-5 font-medium">Predicted Ratio</div>
							<Tooltip title="Predicted Ratio is calculated by using historical ratio, current trends and your goal targets.">
								<FuseSvgIcon
									className="ml-1.5"
									size={16}
									color="disabled"
								>
									lucide:info
								</FuseSvgIcon>
							</Tooltip>
						</div>
						<div className="mt-2 flex items-start">
							<div className="text-4xl leading-none font-bold tracking-tight">{predictedRatio}%</div>
							<div className="ml-2 flex items-center">
								<FuseSvgIcon
									className="text-green-500"
									size={20}
								>
									lucide:trending-up
								</FuseSvgIcon>
								<Typography className="text-md ml-1 font-medium text-green-500">22.2%</Typography>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="mt-3 flex h-80 flex-auto flex-col">
				<ReactApexChart
					className="h-full w-full flex-auto"
					options={chartOptions}
					series={_.cloneDeep(series)}
					type={chartOptions?.chart?.type}
					height={chartOptions?.chart?.height}
				/>
			</div>
		</Paper>
	);
}

export default VisitorsVsPageViewsWidget;
