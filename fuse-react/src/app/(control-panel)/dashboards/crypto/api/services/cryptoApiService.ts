import { api } from '@/utils/api';
import { CryptoDashboardWidgetType } from '../types';

export const cryptoApiService = {
	getWidgets: async (): Promise<Record<string, CryptoDashboardWidgetType>> => {
		return await api.get('mock/crypto-dashboard/widgets').json();
	}
};
