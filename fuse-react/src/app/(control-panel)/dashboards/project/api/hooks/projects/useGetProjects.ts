import { useQuery } from '@tanstack/react-query';
import { projectApiService } from '../../services/projectApiService';

const queryKey = ['projectDashboardApp', 'projects'];

export const useGetProjects = () => {
	return useQuery({
		queryFn: projectApiService.getProjects,
		queryKey
	});
};
