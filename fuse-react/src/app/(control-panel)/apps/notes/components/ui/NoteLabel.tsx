import Chip from '@mui/material/Chip';
import Link from '@fuse/core/Link';
import { MouseEvent } from 'react';
import _ from 'lodash';
import { useLabels } from '../../api/hooks/labels/useLabels';

type NoteLabelProps = {
	id: string;
	linkable?: boolean;
	onDelete?: () => void;
	className?: string;
	classes?: {
		root?: string;
		label?: string;
		deleteIcon?: string;
	};
};

/**
 * The note label.
 */
function NoteLabel(props: NoteLabelProps) {
	const { id, linkable, onDelete, className, classes } = props;
	const { data: labels } = useLabels();

	if (!labels) {
		return null;
	}

	const label = _.find(labels, { id });

	if (!label) {
		return null;
	}

	const linkProps = linkable
		? {
				component: Link,
				onClick: (ev: MouseEvent) => {
					ev.stopPropagation();
				},
				to: `/apps/notes/labels/${label.id}`
			}
		: {};

	return (
		<Chip
			{...linkProps}
			label={label.title}
			classes={{
				root: className,
				...classes
			}}
			variant="outlined"
			onDelete={onDelete}
		/>
	);
}

export default NoteLabel;
