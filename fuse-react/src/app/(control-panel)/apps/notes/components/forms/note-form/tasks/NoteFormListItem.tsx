import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import ListItem from '@mui/material/ListItem';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ChangeEvent } from 'react';
import { NoteListItemType } from '../../../../api/types';
import setIn from '@/utils/setIn';

type NoteFormListItemProps = {
	onListItemRemove: (id: string) => void;
	onListItemChange: (T: NoteListItemType) => void;
	item: NoteListItemType;
};

/**
 * The note form list item.
 */
function NoteFormListItem(props: NoteFormListItemProps) {
	const { onListItemChange, item, onListItemRemove } = props;

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		onListItemChange(
			setIn(
				item,
				event.target.name,
				event.target.type === 'checkbox' ? event.target.checked : event.target.value
			) as NoteListItemType
		);
	}

	if (!item) {
		return null;
	}

	return (
		<ListItem
			className="items-center px-1 py-0"
			key={item.id}
			dense
		>
			<Checkbox
				checked={item.completed}
				tabIndex={-1}
				disableRipple
				name="completed"
				onChange={handleChange}
				color="default"
			/>
			<Input
				className={clsx('flex flex-1', item.completed && 'line-through opacity-50')}
				name="content"
				value={item.content}
				onChange={handleChange}
				classes={{ input: 'p-0' }}
				disableUnderline
			/>
			<IconButton
				className=""
				aria-label="Delete"
				onClick={() => onListItemRemove(item.id)}
			>
				<FuseSvgIcon>lucide:trash</FuseSvgIcon>
			</IconButton>
		</ListItem>
	);
}

export default NoteFormListItem;
