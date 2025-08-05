import FuseLoading from '@fuse/core/FuseLoading';
import WatchlistItem from './widgets/WatchlistItem';
import BuySellForm from './widgets/BuySellForm';
import WatchlistType from '../../api/types/WatchlistType';
import { useGetWidgets } from '../../api/hooks/widgets/useGetWidgets';

/**
 * The crypto dashboard app sidebar.
 */
function CryptoDashboardAppSidebar() {
	const { data: widgets, isLoading } = useGetWidgets();

	if (isLoading) {
		return <FuseLoading />;
	}

	const watchlist = widgets?.watchlist as WatchlistType;

	if (!watchlist) {
		return null;
	}

	return (
		<>
			{watchlist?.map((item) => (
				<WatchlistItem
					key={item.iso}
					item={item}
				/>
			))}
			<BuySellForm />
		</>
	);
}

export default CryptoDashboardAppSidebar;
