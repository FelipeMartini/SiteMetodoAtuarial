import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../../services/contactsApiService';
import { tagsQueryKey } from './useTags';

export const useCreateTag = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: contactsApi.createTag,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tagsQueryKey });
		}
	});
};
