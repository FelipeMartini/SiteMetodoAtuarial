import { useQuery } from '@tanstack/react-query';
import { cryptoApiService } from '../../services/cryptoApiService';

export const widgetsQueryKey = ['cryptoDashboardApp', 'widgets'];

export const useGetWidgets = () => {
	return useQuery({
		queryFn: cryptoApiService.getWidgets,
		queryKey: widgetsQueryKey
	});
};
