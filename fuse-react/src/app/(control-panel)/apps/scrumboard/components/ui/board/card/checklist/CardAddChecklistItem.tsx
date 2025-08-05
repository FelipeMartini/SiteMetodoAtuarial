import Fab from '@mui/material/Fab';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ChecklistItemModel from '../../../../../api/models/ChecklistItemModel';
import { ScrumboardCheckListItem } from '../../../../../api/types';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a title')
});

type CardAddChecklistItemProps = {
	name?: string;
	onListItemAdd: (item: ScrumboardCheckListItem) => void;
};

/**
 * The card add checklist item component.
 */
function CardAddChecklistItem(props: CardAddChecklistItemProps) {
	const { name = '', onListItemAdd } = props;
	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues: {
			name
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	function onSubmit(data: ScrumboardCheckListItem) {
		onListItemAdd(ChecklistItemModel(data));
		reset({
			name
		});
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<ListItem
				className="px-0"
				dense
			>
				<span className="w-9" />
				<Controller
					name="name"
					control={control}
					defaultValue=""
					render={({ field }) => (
						<TextField
							{...field}
							className="mx-2 flex flex-1"
							name="name"
							variant="outlined"
							placeholder="Add an item"
						/>
					)}
				/>
				<Fab
					className="mx-1"
					aria-label="Add"
					size="small"
					color="secondary"
					type="submit"
					disabled={_.isEmpty(dirtyFields) || !isValid}
				>
					<FuseSvgIcon>lucide:plus</FuseSvgIcon>
				</Fab>
			</ListItem>
		</form>
	);
}

export default CardAddChecklistItem;
