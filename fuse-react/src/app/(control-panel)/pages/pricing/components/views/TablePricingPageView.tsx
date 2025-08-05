'use client';
import { useState } from 'react';
import TablePricingTable, { TableDataItemType } from '../ui/table/TablePricingTable';
import PricingContent from '../ui/PricingContent';
import PricingHeader from '../ui/PricingHeader';

/**
 * The table pricing page.
 */
function TablePricingPageView() {
	const [period, setPeriod] = useState<TableDataItemType['period']>('month');

	return (
		<div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">
			<PricingHeader
				tabsValue={period}
				tabsOnChange={(_, value) => setPeriod(value as TableDataItemType['period'])}
			/>

			<div className="px-4 pb-8">
				<TablePricingTable period={period} />
			</div>

			<PricingContent />
		</div>
	);
}

export default TablePricingPageView;
