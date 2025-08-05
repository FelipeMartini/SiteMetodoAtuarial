import { useQuery } from '@tanstack/react-query';
import { profileApiService } from '../services/profileApiService';

export const profilePostsQueryKey = ['profile', 'posts'];

export const useProfilePosts = () => {
	return useQuery({
		queryFn: profileApiService.getPosts,
		queryKey: profilePostsQueryKey
	});
};
