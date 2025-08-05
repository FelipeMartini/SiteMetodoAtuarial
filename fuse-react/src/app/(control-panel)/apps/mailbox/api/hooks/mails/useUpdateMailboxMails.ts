import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mailboxApi } from '../../services/mailboxApiService';
import { mailboxMailsQueryKey } from './useMailboxMails';
import { mailboxMailQueryKey } from './useMailboxMail';
import useParams from '@fuse/hooks/useParams';

export const useUpdateMailboxMails = () => {
	const queryClient = useQueryClient();
	const routeParams = useParams();
	const { mailId } = routeParams;

	return useMutation({
		mutationFn: mailboxApi.updateMails,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: mailboxMailsQueryKey({}) });
			queryClient.invalidateQueries({ queryKey: mailboxMailQueryKey(mailId) });
		}
	});
};
