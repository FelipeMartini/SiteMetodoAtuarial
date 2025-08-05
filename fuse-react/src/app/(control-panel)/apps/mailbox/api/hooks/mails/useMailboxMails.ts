import { useQuery } from '@tanstack/react-query';
import { useMailboxFolders } from '../folders/useMailboxFolders';
import { useMailboxLabels } from '../labels/useMailboxLabels';
import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import { mailboxApi } from '../../services/mailboxApiService';

export const mailboxMailsQueryKey = (params: Record<string, string>) => ['mailbox', 'mails', params];

export const useMailboxMails = () => {
	const routeParams = useParams();
	const { category, subCategory } = routeParams;
	const { data: folders } = useMailboxFolders();
	const { data: labels } = useMailboxLabels();

	let queryParams = {};

	if (category === 'folders') {
		const folderId = _.find(folders, { slug: subCategory })?.id;
		queryParams = { folder: folderId };
	} else if (category === 'filters') {
		queryParams = { [subCategory]: true };
	} else if (category === 'labels') {
		const labelId = _.find(labels, { slug: subCategory })?.id;
		queryParams = { labels: labelId };
	}

	return useQuery({
		queryFn: () => mailboxApi.getMails(queryParams),
		queryKey: mailboxMailsQueryKey(queryParams)
	});
};
