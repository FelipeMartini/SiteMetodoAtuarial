import { useQuery } from '@tanstack/react-query';
import { financeApiService } from '../../services/financeApiService';

export const widgetsQueryKey = ['financeDashboardApp', 'widgets'];

export const useGetWidgets = () => {
	return useQuery({
		queryFn: financeApiService.getWidgets,
		queryKey: widgetsQueryKey
	});
};
