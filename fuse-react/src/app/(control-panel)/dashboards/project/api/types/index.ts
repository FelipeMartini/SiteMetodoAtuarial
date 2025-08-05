import BudgetDetailsDataType from './budget/BudgetDetailsDataType';
import BudgetDistributionDataType from './budget/BudgetDistributionDataType';
import ExpensesDataType from './budget/ExpensesDataType';
import WidgetDataType from './home/WidgetDataType';
import GithubIssuesDataType from './home/GithubIssuesDataType';
import ScheduleDataType from './home/ScheduleDataType';
import TaskDistributionDataType from './home/TaskDistributionDataType';
import TeamMemberType from './team/TeamMemberType';

export type ProjectDashboardWidgetType =
	| BudgetDetailsDataType
	| BudgetDistributionDataType
	| ExpensesDataType
	| WidgetDataType
	| GithubIssuesDataType
	| ScheduleDataType
	| TaskDistributionDataType
	| TeamMemberType[];

export type ProjectType = {
	id: number;
	name: string;
};
