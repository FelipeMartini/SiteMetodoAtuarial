import { Controller, useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import NoteListItemModel from '../../../../api/models/NoteListItemModel';
import { NoteListItemType } from '../../../../api/types';
import { Input } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = z.object({
	content: z.string().nonempty('You must enter a content')
});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
	content: ''
};

type NoteFormAddListItemProps = {
	onListItemAdd: (noteListItem: NoteListItemType) => void;
};

/**
 * The note form add list item.
 */
function NoteFormAddListItem(props: NoteFormAddListItemProps) {
	const { onListItemAdd } = props;

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	function onSubmit(data: FormType) {
		onListItemAdd(NoteListItemModel(data));
		reset(defaultValues);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<ListItem
				className="items-center px-1"
				dense
			>
				<Controller
					name="content"
					control={control}
					render={({ field }) => (
						<Input
							{...field}
							className="flex flex-1"
							placeholder="Add an item"
							autoFocus
							disableUnderline
							startAdornment={
								<IconButton
									className="p-0"
									aria-label="Add"
									type="submit"
									disabled={_.isEmpty(dirtyFields) || !isValid}
								>
									<FuseSvgIcon color="action">lucide:plus</FuseSvgIcon>
								</IconButton>
							}
						/>
					)}
				/>
			</ListItem>
		</form>
	);
}

export default NoteFormAddListItem;
