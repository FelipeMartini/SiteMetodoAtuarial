import FuseUtils from '@fuse/utils';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import MailListItem from './MailListItem';
import { MailboxMail } from '../../../api/types';
import { useMailboxAppContext } from '../../../contexts/MailboxAppContext/useMailboxAppContext';
import { useMailboxMails } from '../../../api/hooks/mails/useMailboxMails';

/**
 * The mail list.
 */
function MailList() {
	const { data: mails, isLoading } = useMailboxMails();
	const { searchText } = useMailboxAppContext();

	const [filteredData, setFilteredData] = useState<MailboxMail[]>([]);

	const { t } = useTranslation('mailboxApp');

	useEffect(() => {
		function getFilteredArray() {
			if (searchText.length === 0) {
				return mails;
			}

			return FuseUtils.filterArrayByString<MailboxMail>(mails, searchText);
		}

		if (mails) {
			setFilteredData(getFilteredArray());
		}
	}, [mails, searchText]);

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!filteredData || filteredData?.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-6"
			>
				<FuseSvgIcon size={40}>lucide:mail</FuseSvgIcon>
				<Typography
					className="text-2xl font-semibold tracking-tight"
					color="text.secondary"
				>
					{t('NO_MESSAGES')}
				</Typography>
			</motion.div>
		);
	}

	return (
		<List className="min-h-full w-full p-0">
			{filteredData.map((mail) => (
				<MailListItem
					mail={mail}
					key={mail.id}
				/>
			))}
		</List>
	);
}

export default MailList;
