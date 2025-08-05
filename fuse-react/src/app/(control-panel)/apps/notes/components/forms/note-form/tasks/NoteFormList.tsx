import List from '@mui/material/List';
import NoteFormAddListItem from './NoteFormAddListItem';
import NoteFormListItem from './NoteFormListItem';
import { NoteListItemType } from '../../../../api/types';

type NoteFormListProps = {
	className?: string;
	tasks: NoteListItemType[];
	onCheckListChange: (tasks: NoteListItemType[]) => void;
};

/**
 * The note form list.
 */
function NoteFormList(props: NoteFormListProps) {
	const { tasks, onCheckListChange, className } = props;

	function handleListItemChange(item: NoteListItemType) {
		onCheckListChange(tasks.map((_item) => (_item.id === item.id ? item : _item)));
	}

	function handleListItemRemove(id: string) {
		onCheckListChange(tasks.filter((_item) => _item.id !== id));
	}

	function handleListItemAdd(item: NoteListItemType) {
		onCheckListChange([...tasks, item]);
	}

	if (!tasks) {
		return null;
	}

	return (
		<div className={className}>
			<List dense>
				{tasks.map((item) => (
					<NoteFormListItem
						item={item}
						key={item.id}
						onListItemChange={handleListItemChange}
						onListItemRemove={handleListItemRemove}
					/>
				))}
				<NoteFormAddListItem onListItemAdd={handleListItemAdd} />
			</List>
		</div>
	);
}

export default NoteFormList;
