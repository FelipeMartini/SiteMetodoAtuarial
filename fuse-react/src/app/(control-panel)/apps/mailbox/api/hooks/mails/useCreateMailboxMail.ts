import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mailboxApi } from '../../services/mailboxApiService';
import { mailboxMailsQueryKey } from './useMailboxMails';

export const useCreateMailboxMail = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: mailboxApi.createMail,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: mailboxMailsQueryKey({}) });
		}
	});
};
