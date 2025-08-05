import { useQuery } from '@tanstack/react-query';
import { mailboxApi } from '../../services/mailboxApiService';

export const mailboxFoldersQueryKey = ['mailbox', 'folders'];

export const useMailboxFolders = () => {
	return useQuery({
		queryFn: mailboxApi.getFolders,
		queryKey: mailboxFoldersQueryKey
	});
};
