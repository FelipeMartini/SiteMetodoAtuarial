import { api } from '@/utils/api';
import { AnalyticsDashboardWidgetType } from '../types';

export const analyticsApiService = {
	getWidgets: async (): Promise<Record<string, AnalyticsDashboardWidgetType>> => {
		return await api.get('mock/analytics-dashboard/widgets').json();
	}
};
