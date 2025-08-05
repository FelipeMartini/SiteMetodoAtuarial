import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { FileManagerItem } from '../types';

/**
 * FileManager Item Model
 */
const FileManagerItemModel = (data: PartialDeep<FileManagerItem>) =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		folderId: '',
		name: '',
		createdBy: '',
		createdAt: '',
		modifiedAt: '',
		size: '',
		type: '',
		contents: '',
		description: ''
	});

export default FileManagerItemModel;
