import { Controller, useForm } from 'react-hook-form';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState, MouseEvent } from 'react';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrumboardBoard } from '../../../api/types';
import { useUpdateScrumboardBoard } from '../../../api/hooks/boards/useUpdateScrumboardBoard';
import { useGetScrumboardBoard } from '../../../api/hooks/boards/useGetScrumboardBoard';
import useParams from '@fuse/hooks/useParams';

/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a title')
});

/**
 * The board title component.
 */
function BoardTitle() {
	const routeParams = useParams<{ boardId: string }>();
	const { boardId } = routeParams;

	const { data: board } = useGetScrumboardBoard(boardId);

	const { mutate: updateBoard } = useUpdateScrumboardBoard();

	const [formOpen, setFormOpen] = useState(false);

	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues: {
			title: board?.title
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	useEffect(() => {
		if (!formOpen) {
			reset({
				title: board?.title
			});
		}
	}, [formOpen, reset, board?.title]);

	function handleOpenForm(ev: MouseEvent<HTMLDivElement>) {
		ev.stopPropagation();
		setFormOpen(true);
	}

	function handleCloseForm() {
		setFormOpen(false);
	}

	function onSubmit(data: ScrumboardBoard) {
		updateBoard({ id: board.id, ...data });
		handleCloseForm();
	}

	return (
		<div className="flex min-w-0 items-center">
			{formOpen ? (
				<ClickAwayListener onClickAway={handleCloseForm}>
					<form
						className="flex w-full"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="title"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									variant="filled"
									margin="none"
									autoFocus
									hiddenLabel
									slotProps={{
										input: {
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														type="submit"
														disabled={_.isEmpty(dirtyFields) || !isValid}
														size="large"
													>
														<FuseSvgIcon>lucide:check</FuseSvgIcon>
													</IconButton>
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
				<div className="flex items-center justify-center gap-3">
					<Typography
						className="cursor-pointer text-2xl leading-none font-extrabold tracking-tight sm:text-4xl"
						onClick={handleOpenForm}
						color="inherit"
					>
						{board?.title}
					</Typography>
					{board?.settings?.subscribed && <FuseSvgIcon>lucide:eye</FuseSvgIcon>}
				</div>
			)}
		</div>
	);
}

export default BoardTitle;
