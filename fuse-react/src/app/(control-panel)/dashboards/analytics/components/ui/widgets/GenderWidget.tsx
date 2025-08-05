import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ApexOptions } from 'apexcharts';
import { useGetWidget } from '../../../api/hooks/widgets/useGetWidget';
import GenderWidgetType from '../../../api/types/GenderWidgetType';
import ReactApexChart from 'react-apexcharts';

/**
 * Gender widget.
 */
function GenderWidget() {
	const theme = useTheme();
	const { data: widget } = useGetWidget<GenderWidgetType>('gender');

	const series = widget?.series || [];
	const labels = widget?.labels;
	const uniqueVisitors = widget?.uniqueVisitors;
	const [awaitRender, setAwaitRender] = useState(true);

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
			height: '100%',
			type: 'donut',
			sparkline: {
				enabled: true
			}
		},
		colors: ['#319795', '#4FD1C5'],
		labels,
		plotOptions: {
			pie: {
				customScale: 0.9,
				expandOnClick: false,
				donut: {
					size: '70%'
				}
			}
		},
		stroke: {
			colors: [theme.palette.background.paper]
		},
		series,
		states: {
			hover: {
				filter: {
					type: 'none'
				}
			},
			active: {
				filter: {
					type: 'none'
				}
			}
		},
		tooltip: {
			enabled: true,
			fillSeriesColor: false,
			theme: 'dark',
			custom: ({
				seriesIndex,
				w
			}: {
				seriesIndex: number;
				w: { config: { colors: string[]; labels: string[]; series: string[] } };
			}) =>
				`<div class="flex items-center h-32 min-h-32 max-h-23 px-12">
            <div class="w-12 h-12 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
            <div class="ml-8 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
            <div class="ml-8 text-md font-bold leading-none">${w.config.series[seriesIndex]}%</div>
        </div>`
		}
	};

	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (awaitRender) {
		return null;
	}

	if (!widget) {
		return null;
	}

	return (
		<Paper className="flex flex-auto flex-col overflow-hidden rounded-xl p-4 shadow-sm">
			<div className="flex flex-col items-start justify-between sm:flex-row">
				<Typography className="truncate text-lg leading-6 font-medium tracking-tight">Gender</Typography>
				<div className="ml-2">
					<Chip
						size="small"
						className="text-sm font-medium"
						label="30 days"
					/>
				</div>
			</div>

			<div className="mt-6 flex h-48 flex-auto flex-col">
				<ReactApexChart
					className="flex h-full w-full flex-auto items-center justify-center"
					options={chartOptions}
					series={series}
					type={chartOptions?.chart?.type}
					height={chartOptions?.chart?.height}
				/>
			</div>
			<div className="mt-8">
				<div className="-my-3 divide-y">
					{series.map((dataset, i) => (
						<div
							className="grid grid-cols-3 py-3"
							key={i}
						>
							<div className="flex items-center">
								<Box
									className="h-2 w-2 shrink-0 rounded-full"
									sx={{ backgroundColor: chartOptions?.colors?.[i] as string }}
								/>
								<Typography className="ml-3 truncate">{labels[i]}</Typography>
							</div>
							<Typography className="text-right font-medium">
								{((uniqueVisitors * dataset) / 100).toLocaleString('en-US')}
							</Typography>
							<Typography
								className="text-right"
								color="text.secondary"
							>
								{dataset}%
							</Typography>
						</div>
					))}
				</div>
			</div>
		</Paper>
	);
}

export default memo(GenderWidget);
