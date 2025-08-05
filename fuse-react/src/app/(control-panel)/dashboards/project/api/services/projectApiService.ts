import { api } from '@/utils/api';
import { ProjectDashboardWidgetType, ProjectType } from '../types';

export const projectApiService = {
	getWidgets: async (): Promise<Record<string, ProjectDashboardWidgetType>> => {
		return await api.get('mock/project-dashboard/widgets').json();
	},
	getProjects: async (): Promise<ProjectType[]> => {
		return await api.get('mock/project-dashboard/projects').json();
	}
};
