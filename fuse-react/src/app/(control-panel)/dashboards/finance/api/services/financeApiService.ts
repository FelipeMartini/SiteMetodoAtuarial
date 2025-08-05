import { api } from '@/utils/api';
import { FinanceDashboardWidgetType } from '../types';

export const financeApiService = {
	getWidgets: async (): Promise<Record<string, FinanceDashboardWidgetType>> => {
		return await api.get('mock/finance-dashboard/widgets').json();
	}
};
