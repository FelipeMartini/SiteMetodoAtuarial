import Chip from '@mui/material/Chip';
import clsx from 'clsx';
import { useMemo } from 'react';
import _ from 'lodash';
import { labelColorDefs } from './labelColors';
import { useMailboxLabels } from '../../../api/hooks/labels/useMailboxLabels';

type MailLabelProps = {
	className?: string;
	labelId?: string;
};

/**
 * The mail label.
 */
function MailLabel(props: MailLabelProps) {
	const { labelId, className = '' } = props;
	const { data: labels } = useMailboxLabels();

	const label = useMemo(() => _.find(labels, { id: labelId }), [labels, labelId]);

	if (!label) {
		return null;
	}

	return (
		<Chip
			label={label.title}
			classes={{
				root: clsx('h-6 border-0', className, label.color && labelColorDefs[label.color].combined),
				label: 'px-3 py-1 text-md font-medium leading-none'
			}}
		/>
	);
}

export default MailLabel;
