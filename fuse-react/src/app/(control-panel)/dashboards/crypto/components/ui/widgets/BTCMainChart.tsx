import { darken, useTheme } from '@mui/material/styles';
import { sub } from 'date-fns/sub';
import { format } from 'date-fns/format';
import { ApexOptions } from 'apexcharts';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useGetWidget } from '../../../api/hooks/widgets/useGetWidget';
import BTCWidgetType from '../../../api/types/BTCWidgetType';

/**
 * The BTC main chart.
 */
function BtcMainChart() {
	const { data: widget, isLoading } = useGetWidget<BTCWidgetType>('btc');

	const series = _.cloneDeep(widget?.price?.series) || [];
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
				enabled: false
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			width: '100%',
			height: '100%',
			type: 'line',
			toolbar: {
				show: false
			},
			zoom: {
				enabled: false
			}
		},
		colors: [theme.palette.secondary.light],
		dataLabels: {
			enabled: false
		},
		grid: {
			borderColor: darken(theme.palette.divider, 0.1),
			position: 'back',
			show: true,
			strokeDashArray: 6,
			xaxis: {
				lines: {
					show: true
				}
			},
			yaxis: {
				lines: {
					show: true
				}
			}
		},
		legend: {
			show: false
		},
		stroke: {
			width: 2,
			curve: 'straight'
		},
		tooltip: {
			followCursor: true,
			theme: 'dark',
			x: {
				format: 'MMM dd, yyyy'
			},
			y: {
				formatter: (value) => `$${value.toFixed(2)}`
			}
		},
		xaxis: {
			type: 'numeric',
			crosshairs: {
				show: true,
				position: 'back',
				fill: {
					type: 'color',
					color: theme.palette.divider
				},
				width: 1,
				stroke: {
					color: theme.palette.secondary.main,
					dashArray: 0,
					width: 2
				},
				opacity: 0.9
			},
			tickAmount: 8,
			axisTicks: {
				show: true,
				color: theme.palette.divider
			},
			axisBorder: {
				show: false
			},
			tooltip: {
				enabled: false
			},
			labels: {
				show: true,
				trim: false,
				rotate: 0,
				minHeight: 40,
				hideOverlappingLabels: true,
				formatter: (value) => format(sub(new Date(), { minutes: Math.abs(parseInt(value, 10)) }), 'HH:mm'),
				style: {
					colors: theme.palette.text.secondary
				}
			}
		},
		yaxis: {
			axisTicks: {
				show: true,
				color: theme.palette.divider
			},
			axisBorder: {
				show: false
			},
			forceNiceScale: true,
			labels: {
				minWidth: 40,
				formatter: (value) => `$${value.toFixed(2)}`,
				style: {
					colors: theme.palette.text.secondary
				}
			}
		}
	};

	return (
		<div className="flex h-full flex-auto flex-col">
			<ReactApexChart
				options={chartOptions}
				series={series}
				type={chartOptions?.chart?.type}
				height={chartOptions?.chart?.height}
			/>
		</div>
	);
}

export default BtcMainChart;
