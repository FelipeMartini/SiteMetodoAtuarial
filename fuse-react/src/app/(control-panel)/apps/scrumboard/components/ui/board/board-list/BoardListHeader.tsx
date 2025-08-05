import { Controller, useForm } from 'react-hook-form';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState, MouseEvent } from 'react';
import _ from 'lodash';
import Box from '@mui/material/Box';
import { darken } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrumboardList } from '../../../../api/types';
import { useDeleteScrumboardBoardList } from '../../../../api/hooks/lists/useDeleteScrumboardBoardList';
import { useUpdateScrumboardBoardList } from '../../../../api/hooks/lists/useUpdateScrumboardBoardList';
import { useUpdateScrumboardBoard } from '../../../../api/hooks/boards/useUpdateScrumboardBoard';
import { useGetScrumboardBoard } from '../../../../api/hooks/boards/useGetScrumboardBoard';

/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a title')
});

type FormType = z.infer<typeof schema>;

type BoardListHeaderProps = {
	list: ScrumboardList;
	boardId: string;
	cardIds: string[];
	handleProps: DraggableProvidedDragHandleProps | null | undefined;
	className?: string;
};

/**
 * The board list header component.
 */
function BoardListHeader(props: BoardListHeaderProps) {
	const { list, cardIds, className, handleProps, boardId } = props;

	const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
	const [formOpen, setFormOpen] = useState(false);

	const { data: board } = useGetScrumboardBoard(boardId);
	const { mutateAsync: updateBoard } = useUpdateScrumboardBoard();
	const { mutateAsync: removeList } = useDeleteScrumboardBoardList();
	const { mutateAsync: updateList } = useUpdateScrumboardBoardList();

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			title: list.title
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	useEffect(() => {
		if (!formOpen) {
			reset({
				title: list.title
			});
		}
	}, [formOpen, reset, list.title]);

	useEffect(() => {
		if (formOpen && anchorEl) {
			setAnchorEl(null);
		}
	}, [anchorEl, formOpen]);

	function handleMenuClick(event: MouseEvent<HTMLButtonElement>) {
		setAnchorEl(event.currentTarget);
	}

	function handleMenuClose() {
		setAnchorEl(null);
	}

	function handleOpenForm(ev: MouseEvent<HTMLAnchorElement | HTMLLIElement>) {
		ev.stopPropagation();
		setFormOpen(true);
	}

	function handleCloseForm() {
		setFormOpen(false);
	}

	function onSubmit(newData: FormType) {
		updateList({ ...list, title: newData.title });
		handleCloseForm();
	}

	return (
		<div {...handleProps}>
			<div className={clsx('flex h-12 items-center justify-between px-3 sm:h-14', className)}>
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
											variant="outlined"
											margin="none"
											autoFocus
											size="small"
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
						<Typography
							className="cursor-pointer text-base font-medium"
							onClick={handleOpenForm}
						>
							{list.title}
						</Typography>
					)}
				</div>
				<div className="flex items-center">
					<Box
						className="mx-1 flex h-6 min-w-6 items-center justify-center rounded-full text-sm leading-[2] font-semibold"
						sx={{
							backgroundColor: (theme) =>
								darken(theme.palette.background.default, theme.palette.mode === 'light' ? 0.1 : 0.3),
							color: 'text.secondary'
						}}
					>
						{cardIds.length}
					</Box>
					<IconButton
						aria-haspopup="true"
						onClick={handleMenuClick}
						size="small"
					>
						<FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>
					</IconButton>
					<Menu
						id="actions-menu"
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
					>
						<MenuItem
							onClick={() => {
								removeList(list.id).then(() => {
									updateBoard({
										...board,
										lists: board.lists.filter((l) => l.id !== list.id)
									});
									handleMenuClose();
								});
							}}
						>
							<ListItemIcon className="min-w-9">
								<FuseSvgIcon>lucide:trash</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Remove List" />
						</MenuItem>
						<MenuItem onClick={handleOpenForm}>
							<ListItemIcon className="min-w-9">
								<FuseSvgIcon>lucide:pencil</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Rename List" />
						</MenuItem>
					</Menu>
				</div>
			</div>
		</div>
	);
}

export default BoardListHeader;
