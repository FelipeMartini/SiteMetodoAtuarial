import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Chat } from '../types';

/**
 * Chat list item model.
 */
function ChatListItemModel(data?: PartialDeep<Chat>) {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		contactId: null,
		unreadCount: 0,
		muted: false,
		lastMessage: '',
		lastMessageAt: null
	});
}

export default ChatListItemModel;
