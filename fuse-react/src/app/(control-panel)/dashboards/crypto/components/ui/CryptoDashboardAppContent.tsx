import BtcMainChart from './widgets/BTCMainChart';

/**
 * Crypto Dashboard App Content
 */
function CryptoDashboardAppContent() {
	return (
		<div className="flex max-w-full min-w-0 flex-auto flex-col overflow-hidden">
			<BtcMainChart />
		</div>
	);
}

export default CryptoDashboardAppContent;
