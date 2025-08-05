import { useQuery } from '@tanstack/react-query';
import { projectApiService } from '../../services/projectApiService';

export const widgetsQueryKey = ['projectDashboardApp', 'widgets'];

export const useGetWidgets = () => {
	return useQuery({
		queryFn: projectApiService.getWidgets,
		queryKey: widgetsQueryKey
	});
};
