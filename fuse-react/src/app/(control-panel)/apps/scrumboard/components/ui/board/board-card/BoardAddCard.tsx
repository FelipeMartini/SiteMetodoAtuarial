import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { MouseEvent, useEffect, useState } from 'react';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateScrumboardBoardCard } from '../../../../api/hooks/cards/useCreateScrumboardBoardCard';
import { useUpdateScrumboardBoard } from '../../../../api/hooks/boards/useUpdateScrumboardBoard';
import { useGetScrumboardBoard } from '../../../../api/hooks/boards/useGetScrumboardBoard';
import Card from '@mui/material/Card';
const defaultValues = {
	title: ''
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a title')
});

type FormType = z.infer<typeof schema>;

type BoardAddCardProps = {
	boardId: string;
	listId: string;
	onCardAdded: () => void;
	className?: string;
};

/**
 * The board add card component.
 */
function BoardAddCard(props: BoardAddCardProps) {
	const { boardId, listId, onCardAdded, className } = props;
	const [formOpen, setFormOpen] = useState(false);

	const { data: board } = useGetScrumboardBoard(boardId);
	const { mutate: updateBoard } = useUpdateScrumboardBoard();
	const { mutateAsync: createCard } = useCreateScrumboardBoardCard();

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

	function onSubmit(card: FormType) {
		createCard({ boardId, listId, card }).then((newCard) => {
			updateBoard({
				...board,
				lists: board.lists.map((list) =>
					list.id === listId
						? {
								...list,
								cards: [...list.cards, newCard.id]
							}
						: list
				)
			});
			onCardAdded();
		});

		handleCloseForm();
	}

	return (
		<Card
			className={`w-full rounded-lg border-1 ${className}`}
			square
			elevation={0}
		>
			{formOpen ? (
				<ClickAwayListener onClickAway={handleCloseForm}>
					<form
						// className="p-3"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="title"
							control={control}
							render={({ field }) => (
								<TextField
									sx={{
										'& .MuiOutlinedInput-root': {
											paddingRight: '2px'
										}
									}}
									size="medium"
									required
									fullWidth
									variant="outlined"
									placeholder="Card title*"
									autoFocus
									slotProps={{
										input: {
											...field,
											endAdornment: (
												<InputAdornment
													className="flex min-h-full items-center"
													position="end"
												>
													<IconButton
														onClick={handleCloseForm}
														size="small"
													>
														<FuseSvgIcon>lucide:x</FuseSvgIcon>
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
					variant="contained"
					onClick={handleOpenForm}
					classes={{
						root: 'w-full rounded-lg p-4 justify-start'
					}}
					startIcon={<FuseSvgIcon>lucide:circle-plus</FuseSvgIcon>}
				>
					Add another card
				</Button>
			)}
		</Card>
	);
}

export default BoardAddCard;
