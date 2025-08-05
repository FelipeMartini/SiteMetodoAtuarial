import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useEffect, useState, MouseEvent } from 'react';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useParams from '@fuse/hooks/useParams';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScrumboardList } from '../../../../api/types';
import { useCreateScrumboardBoardList } from '../../../../api/hooks/lists/useCreateScrumboardBoardList';
import { useUpdateScrumboardBoard } from '../../../../api/hooks/boards/useUpdateScrumboardBoard';
import { useGetScrumboardBoard } from '../../../../api/hooks/boards/useGetScrumboardBoard';

// type FormType = {
// 	title: ScrumboardList['title'];
// };

const defaultValues: {
	title: ScrumboardList['title'];
} = {
	title: ''
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().min(1, 'You must enter a title').nonempty('You must enter a title')
});

type FormType = z.infer<typeof schema>;

/**
 * The board add list component.
 */
function BoardAddList() {
	const routeParams = useParams();
	const { boardId } = routeParams as { boardId: string };

	const { data: board } = useGetScrumboardBoard(boardId);
	const { mutateAsync: updateBoard } = useUpdateScrumboardBoard();

	const { mutateAsync: createList } = useCreateScrumboardBoardList();

	const [formOpen, setFormOpen] = useState(false);

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	useEffect(() => {
		if (!formOpen) {
			reset(defaultValues);
		}
	}, [formOpen, reset]);

	function handleOpenForm(ev: MouseEvent<HTMLButtonElement>) {
		ev.stopPropagation();
		setFormOpen(true);
	}

	function handleCloseForm() {
		setFormOpen(false);
	}

	function onSubmit(data: FormType) {
		const payload = {
			boardId,
			title: data.title
		};
		createList(payload).then((res) => {
			const newList = res as ScrumboardList;
			updateBoard({
				...board,
				lists: [...board.lists, { id: newList.id, cards: [] }]
			});
			handleCloseForm();
		});
	}

	return (
		<div>
			<Card
				className="w-80 rounded-lg border-1"
				square
				elevation={0}
			>
				{formOpen ? (
					<ClickAwayListener onClickAway={handleCloseForm}>
						<form
							className="p-3"
							onSubmit={handleSubmit(onSubmit)}
						>
							<Controller
								name="title"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										sx={{
											'& .MuiOutlinedInput-root': {
												paddingRight: '2px'
											}
										}}
										size="medium"
										required
										fullWidth
										variant="outlined"
										placeholder="List title*"
										autoFocus
										slotProps={{
											input: {
												endAdornment: (
													<InputAdornment position="end">
														<IconButton
															onClick={handleCloseForm}
															size="small"
														>
															<FuseSvgIcon size={18}>lucide:x</FuseSvgIcon>
														</IconButton>
														<Button
															className="mx-1 min-h-0 rounded-sm px-2 py-1"
															variant="contained"
															color="secondary"
															type="submit"
															disabled={_.isEmpty(dirtyFields) || !isValid}
														>
															Add
														</Button>
													</InputAdornment>
												)
											}
										}}
									/>
								)}
							/>
						</form>
					</ClickAwayListener>
				) : (
					<Button
						onClick={handleOpenForm}
						classes={{
							root: 'w-full p-4 justify-start'
						}}
						variant="contained"
						startIcon={<FuseSvgIcon>lucide:circle-plus</FuseSvgIcon>}
					>
						Add another list
					</Button>
				)}
			</Card>
		</div>
	);
}

export default BoardAddList;
