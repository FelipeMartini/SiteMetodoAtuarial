import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { ApexOptions } from 'apexcharts';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';
import AccountBalanceWidgetType from '../../../api/types/AccountBalanceWidgetType';
import ReactApexChart from 'react-apexcharts';
import { useGetWidget } from '../../../api/hooks/widgets/useGetWidget';

/**
 * The AccountBalanceWidget widget.
 */
function AccountBalanceWidget() {
	const { data: widget, isLoading } = useGetWidget<AccountBalanceWidgetType>('accountBalance');

	const series = widget?.series || [];
	const growRate = widget?.growRate;
	const ami = widget?.ami;

	const theme = useTheme();

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				speed: 400,
				animateGradually: {
					enabled: false
				}
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			width: '100%',
			height: '100%',
			type: 'area',
			sparkline: {
				enabled: true
			}
		},
		colors: [theme.palette.secondary.light, theme.palette.secondary.light],
		fill: {
			colors: [theme.palette.secondary.dark, theme.palette.secondary.light],
			opacity: 0.5
		},
		series,
		stroke: {
			curve: 'straight',
			width: 2
		},
		tooltip: {
			followCursor: true,
			theme: 'dark',
			x: {
				format: 'MMM dd, yyyy'
			},
			y: {
				formatter: (value) => `${value}%`
			}
		},
		xaxis: {
			type: 'datetime'
		}
	};

	return (
		<Paper className="flex flex-auto flex-col overflow-hidden rounded-xl shadow-sm">
			<div className="flex flex-col p-6 pb-4">
				<div className="flex items-start justify-between">
					<div className="flex flex-col">
						<Typography className="truncate text-lg leading-6 font-medium tracking-tight">
							Account Balance
						</Typography>
						<Typography
							className="font-medium"
							color="text.secondary"
						>
							Monthly balance growth and avg. monthly income
						</Typography>
					</div>

					<div>
						<Chip
							size="small"
							className="text-sm font-medium"
							label="12 months"
						/>
					</div>
				</div>
				<div className="mt-6 mr-2 flex items-start">
					<div className="flex flex-col">
						<Typography className="text-3xl font-semibold tracking-tighter md:text-5xl">
							{growRate}%
						</Typography>
						<Typography
							className="text-sm leading-none font-medium"
							color="text.secondary"
						>
							Average Monthly Growth
						</Typography>
					</div>
					<div className="ml-8 flex flex-col md:ml-16">
						<Typography className="text-3xl font-semibold tracking-tighter md:text-5xl">
							{ami.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})}
						</Typography>
						<Typography
							className="text-sm leading-none font-medium"
							color="text.secondary"
						>
							Average Monthly Income
						</Typography>
					</div>
				</div>
			</div>
			<div className="flex flex-auto flex-col">
				<ReactApexChart
					className="-mb-1 h-full w-full flex-auto"
					options={chartOptions}
					series={_.cloneDeep(series)}
					type={chartOptions?.chart?.type}
					height={chartOptions?.chart?.height}
				/>
			</div>
		</Paper>
	);
}

export default AccountBalanceWidget;
