import { useQuery } from '@tanstack/react-query';
import { mailboxApi } from '../../services/mailboxApiService';

export const mailboxLabelsQueryKey = ['mailbox', 'labels'];

export const useMailboxLabels = () => {
	return useQuery({
		queryFn: mailboxApi.getLabels,
		queryKey: mailboxLabelsQueryKey
	});
};
