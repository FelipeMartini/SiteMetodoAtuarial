import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { ApexOptions } from 'apexcharts';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';
import BudgetDistributionDataType from '../../../../../api/types/budget/BudgetDistributionDataType';
import { useGetWidget } from '../../../../../api/hooks/widgets/useGetWidget';
import ReactApexChart from 'react-apexcharts';

/**
 * The BudgetDistributionWidget widget.
 */
function BudgetDistributionWidget() {
	const { data: widget, isLoading } = useGetWidget<BudgetDistributionDataType>('budgetDistribution');

	const categories = widget?.categories;
	const series = widget?.series || [];
	const theme = useTheme();

	const chartOptions: ApexOptions = {
		chart: {
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'radar',
			sparkline: {
				enabled: true
			}
		},
		colors: [theme.palette.secondary.main],
		dataLabels: {
			enabled: true,
			formatter: (val: string) => `${val}%`,
			textAnchor: 'start',
			style: {
				fontSize: '13px',
				fontWeight: 500
			},
			background: {
				borderWidth: 0,
				padding: 4
			},
			offsetY: -15
		},
		markers: {
			strokeColors: theme.palette.primary.main,
			strokeWidth: 4
		},
		plotOptions: {
			radar: {
				polygons: {
					strokeColors: theme.palette.divider,
					connectorColors: theme.palette.divider
				}
			}
		},
		stroke: {
			width: 2
		},
		tooltip: {
			theme: 'dark',
			y: {
				formatter: (val) => `${val}%`
			}
		},
		xaxis: {
			labels: {
				show: true,
				style: {
					fontSize: '12px',
					fontWeight: '500'
				}
			},
			categories
		},
		yaxis: {
			max: (max) => parseInt((max + 10).toFixed(0), 10),
			tickAmount: 7
		}
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	return (
		<Paper className="flex h-full flex-auto flex-col overflow-hidden rounded-xl p-6 shadow-sm">
			<Typography className="truncate text-lg leading-6 font-medium tracking-tight">
				Budget Distribution
			</Typography>

			<div className="flex flex-auto flex-col">
				<ReactApexChart
					className="h-80 w-full flex-auto"
					options={chartOptions}
					series={_.cloneDeep(series)}
					type={chartOptions?.chart?.type}
					height={chartOptions?.chart?.height}
				/>
			</div>
		</Paper>
	);
}

export default memo(BudgetDistributionWidget);
