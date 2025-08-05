import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Message } from '../types';

/**
 * Chat message model.
 */
function ChatMessageModel(data?: PartialDeep<Message>) {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		chatId: '',
		contactId: '',
		value: '',
		createdAt: new Date().toISOString()
	});
}

export default ChatMessageModel;
