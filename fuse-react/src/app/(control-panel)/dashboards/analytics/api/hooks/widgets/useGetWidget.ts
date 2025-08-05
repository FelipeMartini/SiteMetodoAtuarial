import { AnalyticsDashboardWidgetType } from '../../types';
import { useGetWidgets } from './useGetWidgets';

export const useGetWidget = <T extends AnalyticsDashboardWidgetType>(widgetId: string) => {
	const { data, ...rest } = useGetWidgets();

	return {
		...rest,
		data: data ? (data[widgetId] as T) : undefined
	};
};
