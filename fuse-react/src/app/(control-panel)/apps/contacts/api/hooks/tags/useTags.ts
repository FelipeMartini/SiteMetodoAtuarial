import { useQuery } from '@tanstack/react-query';
import { contactsApi } from '../../services/contactsApiService';
import { Tag } from '../../types';

export const tagsQueryKey = ['contacts', 'tags'];
export const tagQueryKey = (tagId: string) => ['contacts', 'tag', tagId];

export const useTags = () => {
	return useQuery<Tag[]>({
		queryFn: contactsApi.getTags,
		queryKey: tagsQueryKey
	});
};
