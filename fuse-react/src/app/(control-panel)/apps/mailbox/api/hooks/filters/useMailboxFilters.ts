import { useQuery } from '@tanstack/react-query';
import { mailboxApi } from '../../services/mailboxApiService';

export const mailboxFiltersQueryKey = ['mailbox', 'filters'];

export const useMailboxFilters = () => {
	return useQuery({
		queryFn: mailboxApi.getFilters,
		queryKey: mailboxFiltersQueryKey
	});
};
