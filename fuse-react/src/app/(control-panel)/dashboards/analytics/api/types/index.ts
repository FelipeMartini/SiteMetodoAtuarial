import AgeWidgetType from './AgeWidgetType';
import ConversionsWidgetType from './ConversionsWidgetType';
import GenderWidgetType from './GenderWidgetType';
import ImpressionsWidgetType from './ImpressionsWidgetType';
import LanguageWidgetType from './LanguageWidgetType';
import NewVsReturningWidgetType from './NewVsReturningWidgetType';
import VisitsWidgetType from './VisitsWidgetType';
import VisitorsVsPageViewsType from './VisitorsVsPageViewsType';

export type AnalyticsDashboardWidgetType =
	| AgeWidgetType
	| ConversionsWidgetType
	| GenderWidgetType
	| ImpressionsWidgetType
	| LanguageWidgetType
	| NewVsReturningWidgetType
	| VisitsWidgetType
	| VisitorsVsPageViewsType;
