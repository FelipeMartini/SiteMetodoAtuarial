import AccountBalanceWidgetType from './AccountBalanceWidgetType';
import BudgetWidgetType from './BudgetWidgetType';
import CurrentStatementWidgetType from './CurrentStatementWidgetType';
import PreviousStatementWidgetType from './PreviousStatementWidgetType';
import RecentTransactionsWidgetType from './RecentTransactionsWidgetType';

export type FinanceDashboardWidgetType =
	| AccountBalanceWidgetType
	| BudgetWidgetType
	| CurrentStatementWidgetType
	| PreviousStatementWidgetType
	| RecentTransactionsWidgetType;
