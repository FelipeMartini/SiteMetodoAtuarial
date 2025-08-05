'use client';

import MailList from '../ui/mails/MailList';
import MailsToolbar from '../ui/mails/MailsToolbar';

/**
 * The mails component.
 */
function MailboxMailsView() {
	return (
		<div className="flex min-h-full w-full flex-col">
			<MailsToolbar />
			<MailList />
		</div>
	);
}

export default MailboxMailsView;
