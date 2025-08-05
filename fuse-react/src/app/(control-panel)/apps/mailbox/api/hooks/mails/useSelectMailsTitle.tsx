import { useMemo } from 'react';
import _ from 'lodash';
import useParams from '@fuse/hooks/useParams';
import { useMailboxFilters } from '../filters/useMailboxFilters';
import { useMailboxFolders } from '../folders/useMailboxFolders';
import { useMailboxLabels } from '../labels/useMailboxLabels';

function useSelectMailsTitle() {
	const { data: folders } = useMailboxFolders();
	const { data: labels } = useMailboxLabels();
	const { data: filters } = useMailboxFilters();
	const routeParams = useParams();
	const { category, subCategory: slug } = routeParams;

	const title = useMemo(() => {
		let _title = '';

		if (category === 'folders') {
			_title = _.find(folders, { slug })?.title;
		}

		if (category === 'labels') {
			_title = _.find(labels, { slug })?.title;
		}

		if (category === 'filters') {
			_title = _.find(filters, { slug })?.title;
		}

		return _title;
	}, [folders, labels, filters, category, slug]);

	return title;
}

export default useSelectMailsTitle;
