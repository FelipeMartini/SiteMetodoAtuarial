import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import clsx from 'clsx';
import Divider from '@mui/material/Divider';
import { MouseEvent } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import ValueSectionSmall from './widgets/ValueSectionSmall';
import BTCWidgetType from '../../api/types/BTCWidgetType';
import { useGetWidgets } from '../../api/hooks/widgets/useGetWidgets';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

type CryptoDashboardAppHeaderProps = {
	onToggleLeftSidebar: (ev: MouseEvent) => void;
};

/**
 * The crypto dashboard app header.
 */
function CryptoDashboardAppHeader(props: CryptoDashboardAppHeaderProps) {
	const { onToggleLeftSidebar } = props;
	const { data: widgets, isLoading } = useGetWidgets();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	if (isLoading) {
		return <FuseLoading />;
	}

	const btc = widgets?.btc as BTCWidgetType;

	if (!btc) {
		return null;
	}

	return (
		<div className="flex w-full flex-wrap items-center gap-4 p-4 pb-0 md:gap-0 md:pb-0">
			<div className="flex w-full items-center gap-2">
				{isMobile && (
					<IconButton
						onClick={(ev) => onToggleLeftSidebar(ev)}
						aria-label="open left sidebar"
						className="border-divider h-6 w-6 rounded-md border"
						size="small"
					>
						<FuseSvgIcon>lucide:menu</FuseSvgIcon>
					</IconButton>
				)}

				<PageBreadcrumb />
			</div>

			<div className="flex flex-auto flex-col">
				<div className="flex items-center gap-2">
					<Typography
						className="text-2xl font-medium"
						color="text.secondary"
					>
						Bitcoin
					</Typography>
					<Typography
						className="text-lg font-medium tracking-wider"
						color="text.secondary"
					>
						(BTC)
					</Typography>
				</div>
				<div className="mt-1 flex items-end gap-1.5">
					<Typography className="font-mono text-3xl leading-none tracking-tight">
						{btc.amount.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography>
					<div className="flex items-end">
						<FuseSvgIcon
							size={20}
							className={clsx(
								'mx-0.5 mb-px text-green-500',
								btc.trend.dir === 'up' && 'text-green-500',
								btc.trend.dir === 'down' && 'text-red-500'
							)}
						>
							{btc.trend.dir === 'up' ? 'lucide:arrow-up' : 'lucide:arrow-down'}
						</FuseSvgIcon>

						<Typography
							className={clsx(
								'mb-px font-mono text-lg leading-none font-medium',
								btc.trend.dir === 'up' && 'text-green-500',
								btc.trend.dir === 'down' && 'text-red-500'
							)}
						>
							{btc.trend.amount.toLocaleString('en-US', {
								style: 'currency',
								currency: 'USD'
							})}
							%
						</Typography>
					</div>
				</div>
			</div>

			<div className="flex items-center rounded-lg border">
				<ValueSectionSmall
					title="Market Cap"
					unit="B"
					value={btc.marketCap}
				/>
				<Divider
					orientation="vertical"
					flexItem
				/>
				<ValueSectionSmall
					title="Volume"
					unit="B"
					value={btc.volume}
				/>
				<Divider
					orientation="vertical"
					flexItem
				/>
				<ValueSectionSmall
					title="Supply"
					unit="M"
					value={btc.supply}
				/>
				<Divider
					orientation="vertical"
					flexItem
				/>
				<ValueSectionSmall
					title="All Time High"
					value={btc.allTimeHigh}
				/>
			</div>
		</div>
	);
}

export default CryptoDashboardAppHeader;
