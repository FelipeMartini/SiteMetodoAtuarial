import { CryptoDashboardWidgetType } from '../../types';
import { useGetWidgets } from './useGetWidgets';

export const useGetWidget = <T extends CryptoDashboardWidgetType>(widgetId: string) => {
	const { data, ...rest } = useGetWidgets();

	return {
		...rest,
		data: data ? (data[widgetId] as T) : undefined
	};
};
