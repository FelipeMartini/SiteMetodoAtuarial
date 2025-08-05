'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import FuseNavigation from '@fuse/core/FuseNavigation';
import FuseNavItemModel from '@fuse/core/FuseNavigation/models/FuseNavItemModel';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useMemo } from 'react';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import MailComposeDialog from '../dialogs/MailComposeDialog';
import { useMailboxFolders } from '../../api/hooks/folders/useMailboxFolders';
import { useMailboxLabels } from '../../api/hooks/labels/useMailboxLabels';
import { useMailboxFilters } from '../../api/hooks/filters/useMailboxFilters';

/**
 * The mailbox app sidebar view.
 */
function MailboxSidebarView() {
	const { data: folders } = useMailboxFolders();
	const { data: labels } = useMailboxLabels();
	const { data: filters } = useMailboxFilters();

	const { t } = useTranslation('mailboxApp');

	const navigationItems = useMemo(
		() => ({
			folders: folders?.map((item) => ({
				...item,
				type: 'item',
				url: `/apps/mailbox/folders/${item.slug}`
			})),
			filters: filters?.map((item) => ({
				...item,
				type: 'item',
				url: `/apps/mailbox/filters/${item.slug}`
			})),
			labels: labels?.map((item) =>
				FuseNavItemModel({
					...item,
					type: 'item',
					url: `/apps/mailbox/labels/${item.slug}`,
					icon: 'lucide:tag',
					sx: {
						'& > .fuse-list-item-icon': {
							color: `${item.color}!important`,
							opacity: 0.6
						}
					}
				})
			)
		}),
		[folders, filters, labels]
	);

	return (
		<div className="flex-auto border-l-1">
			<div className="mx-4 pt-1 pb-4">
				<PageBreadcrumb
					maxItems={3}
					className="mb-2"
				/>

				<Typography className="mb-4 text-3xl leading-none font-extrabold tracking-tight">Mailbox</Typography>
				<MailComposeDialog />
			</div>

			{['FOLDERS', 'FILTERS', 'LABELS'].map((section, index) => (
				<motion.div
					key={section}
					className="mb-6"
					initial={false}
					animate={{ y: 0, opacity: 1 }}
					transition={{ delay: 0.1 * (index + 1) }}
				>
					<Typography
						className="text-md px-5 py-2.5 font-semibold uppercase"
						color="secondary.main"
					>
						{t(section)}
					</Typography>

					<FuseNavigation
						navigation={navigationItems[section.toLowerCase()] as FuseNavItemType[]}
						className="px-3"
					/>
				</motion.div>
			))}
		</div>
	);
}

export default MailboxSidebarView;
