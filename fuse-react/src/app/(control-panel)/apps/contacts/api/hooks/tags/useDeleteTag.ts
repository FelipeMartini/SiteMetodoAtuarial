import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../../services/contactsApiService';
import { tagsQueryKey, tagQueryKey } from './useTags';
export const useDeleteTag = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: contactsApi.deleteTag,
		onSuccess: (_, tagId) => {
			queryClient.invalidateQueries({ queryKey: tagsQueryKey });
			queryClient.invalidateQueries({ queryKey: tagQueryKey(tagId) });
		}
	});
};
