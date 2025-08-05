import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mailboxApi } from '../../services/mailboxApiService';
import type { MailboxLabel } from '../../types';
import { mailboxLabelsQueryKey } from './useMailboxLabels';

export const useUpdateMailboxLabel = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ labelSlug, label }: { labelSlug: string; label: MailboxLabel }) =>
			mailboxApi.updateLabel(labelSlug, label),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: mailboxLabelsQueryKey });
		}
	});
};
