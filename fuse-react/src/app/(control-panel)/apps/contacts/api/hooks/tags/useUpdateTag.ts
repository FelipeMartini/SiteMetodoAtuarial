import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../../services/contactsApiService';
import { tagsQueryKey, tagQueryKey } from './useTags';

export const useUpdateTag = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: contactsApi.updateTag,
		onSuccess: (_, tag) => {
			queryClient.invalidateQueries({ queryKey: tagsQueryKey });
			queryClient.invalidateQueries({ queryKey: tagQueryKey(tag.id) });
		}
	});
};
