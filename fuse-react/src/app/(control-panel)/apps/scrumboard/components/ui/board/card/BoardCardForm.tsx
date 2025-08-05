import { useDebounce, useDeepCompareEffect } from '@fuse/hooks';
import _ from 'lodash';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import clsx from 'clsx';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import { fromUnixTime } from 'date-fns/fromUnixTime';
import { getUnixTime } from 'date-fns/getUnixTime';
import { format } from 'date-fns/format';
import { Controller, useForm } from 'react-hook-form';
import { SyntheticEvent, useEffect } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import useParams from '@fuse/hooks/useParams';
import FuseLoading from '@fuse/core/FuseLoading';
import CardActivity from './activity/CardActivity';
import CardAttachment from './attachment/CardAttachment';
import CardChecklist from './checklist/CardChecklist';
import CardComment from './comment/CardComment';
import DueMenu from './toolbar/DueMenu';
import LabelsMenu from './toolbar/LabelsMenu';
import MembersMenu from './toolbar/MembersMenu';
import CheckListMenu from './toolbar/CheckListMenu';
import OptionsMenu from './toolbar/OptionsMenu';
import {
	ScrumboardCard,
	ScrumboardChecklist,
	ScrumboardComment,
	ScrumboardLabel,
	ScrumboardMember
} from '../../../../api/types';
import setIn from '@/utils/setIn';
import { useScrumboardAppContext } from '../../../../contexts/ScrumboardAppContext/useScrumboardAppContext';
import { useUpdateScrumboardBoard } from '../../../../api/hooks/boards/useUpdateScrumboardBoard';
import { useGetScrumboardBoard } from '../../../../api/hooks/boards/useGetScrumboardBoard';
import { useGetScrumboardMembers } from '../../../../api/hooks/members/useGetScrumboardMembers';
import { useGetScrumboardBoardLabels } from '../../../../api/hooks/labels/useGetScrumboardBoardLabels';
import { useGetScrumboardBoardLists } from '../../../../api/hooks/lists/useGetScrumboardBoardLists';
import { useUpdateScrumboardBoardCard } from '../../../../api/hooks/cards/useUpdateScrumboardBoardCard';
import { useDeleteScrumboardBoardCard } from '../../../../api/hooks/cards/useDeleteScrumboardBoardCard';
import { useSnackbar } from 'notistack';

/**
 * The board card form component.
 */
function BoardCardForm() {
	const routeParams = useParams<{ boardId: string }>();
	const { boardId } = routeParams;
	const { enqueueSnackbar } = useSnackbar();
	const { cardDialog, closeCardDialog } = useScrumboardAppContext();
	const card = cardDialog?.data;

	const { data: board, isLoading: isBoardLoading } = useGetScrumboardBoard(boardId);
	const { data: members, isLoading: isMembersLoading } = useGetScrumboardMembers();
	const { data: labels, isLoading: isLabelsLoading } = useGetScrumboardBoardLabels(boardId);
	const { data: listItems, isLoading: isListItemsLoading } = useGetScrumboardBoardLists(boardId);
	const loading = isBoardLoading || isMembersLoading || isLabelsLoading || isListItemsLoading;

	const { mutateAsync: updateCard } = useUpdateScrumboardBoardCard();
	const { mutateAsync: removeCard } = useDeleteScrumboardBoardCard();
	const { mutate: updateBoard } = useUpdateScrumboardBoard();

	const list = _.find(listItems, { id: card?.listId });

	const { register, watch, control, setValue, formState } = useForm<ScrumboardCard>({
		mode: 'onChange',
		defaultValues: card
	});

	const { isValid } = formState;
	const cardForm = watch();

	const updateCardData = useDebounce((newCard: ScrumboardCard) => {
		updateCard(newCard).then(() => {
			enqueueSnackbar('Card Saved', {
				variant: 'success'
			});
		});
	}, 600);

	/**
	 * Update Card
	 */
	useDeepCompareEffect(() => {
		if (!(!isValid || _.isEmpty(cardForm) || !card) && !_.isEqual(card, cardForm)) {
			updateCardData(cardForm);
		}
	}, [cardForm, isValid]);

	useEffect(() => {
		register('attachmentCoverId');
	}, [register]);

	if (loading) {
		return <FuseLoading />;
	}

	return (
		<DialogContent className="flex flex-col p-2 sm:flex-row">
			<div className="flex flex-auto flex-col px-0 py-4 sm:px-4">
				<div className="mb-6 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
					<div className="mb-4 flex items-center sm:mb-0">
						<Typography>{board.title}</Typography>

						<FuseSvgIcon>lucide:chevron-right</FuseSvgIcon>

						<Typography>{list && list.title}</Typography>
					</div>

					{cardForm.dueDate && (
						<DateTimePicker
							value={new Date(format(fromUnixTime(cardForm.dueDate), 'Pp'))}
							format="Pp"
							onChange={(val) => setValue('dueDate', getUnixTime(val))}
							className="w-full sm:w-auto"
							slotProps={{
								textField: {
									label: 'Due date',
									placeholder: 'Choose a due date',
									InputLabelProps: {
										shrink: true
									},
									size: 'small',
									fullWidth: true,
									variant: 'outlined'
								}
							}}
						/>
					)}
				</div>

				<div className="mb-6 flex items-center">
					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Title"
								type="text"
								variant="outlined"
								fullWidth
								required
								slotProps={{
									input: {
										endAdornment: (
											<InputAdornment position="end">
												{card?.subscribed && (
													<FuseSvgIcon
														size={20}
														color="action"
													>
														lucide:eye
													</FuseSvgIcon>
												)}
											</InputAdornment>
										)
									}
								}}
							/>
						)}
					/>
				</div>

				<div className="mb-6 w-full">
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								label="Description"
								multiline
								rows="4"
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>

				{cardForm.labels && cardForm.labels.length > 0 && (
					<div className="mx-2 mb-6 flex-1">
						<div className="mt-4 mb-3 flex items-center">
							<FuseSvgIcon>lucide:tag</FuseSvgIcon>
							<Typography className="mx-2 text-lg font-semibold">Labels</Typography>
						</div>
						<Autocomplete
							className="mt-2 mb-4"
							multiple
							freeSolo
							options={labels}
							getOptionLabel={(option: string | ScrumboardLabel) => {
								if (typeof option === 'string') {
									return option;
								}

								return option?.title;
							}}
							value={cardForm.labels.map((id) => _.find(labels, { id }))}
							onChange={(_event: SyntheticEvent<Element, Event>, value: (string | ScrumboardLabel)[]) => {
								const ids = value
									.filter((item): item is ScrumboardLabel => typeof item !== 'string')
									.map((item) => item.id);
								setValue('labels', ids);
							}}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => {
									const { key, ...rest } = getTagProps({ index });
									return (
										<Chip
											key={key}
											label={typeof option === 'string' ? option : option?.title}
											className="m-0.75"
											{...rest}
										/>
									);
								})
							}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Select multiple Labels"
									label="Labels"
									variant="outlined"
									InputLabelProps={{
										shrink: true
									}}
								/>
							)}
						/>
					</div>
				)}

				{cardForm.memberIds && cardForm.memberIds.length > 0 && (
					<div className="mx-2 mb-6 flex-1">
						<div className="mt-4 mb-3 flex items-center">
							<FuseSvgIcon>lucide:users</FuseSvgIcon>
							<Typography className="mx-2 text-lg font-semibold">Members</Typography>
						</div>
						<Autocomplete
							className="mt-2 mb-4"
							multiple
							freeSolo
							options={members}
							getOptionLabel={(member: string | ScrumboardMember) => {
								return typeof member === 'string' ? member : member?.name;
							}}
							value={cardForm.memberIds.map((id) => _.find(members, { id }))}
							onChange={(
								_event: SyntheticEvent<Element, Event>,
								value: (string | ScrumboardMember)[]
							) => {
								const ids = value
									.filter((item): item is ScrumboardMember => typeof item !== 'string')
									.map((item) => item.id);
								setValue('memberIds', ids);
							}}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => {
									if (typeof option === 'string') {
										// eslint-disable-next-line react/jsx-key
										return <span />;
									}

									const { key, ...rest } = getTagProps({ index });
									return (
										<Chip
											key={key}
											label={option.name}
											className={clsx('m-0.75', option?.class)}
											{...rest}
											avatar={
												<Tooltip title={option.name}>
													<Avatar src={option.avatar} />
												</Tooltip>
											}
										/>
									);
								})
							}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Select multiple Members"
									label="Members"
									variant="outlined"
									InputLabelProps={{
										shrink: true
									}}
								/>
							)}
						/>
					</div>
				)}

				{cardForm.attachments && cardForm.attachments.length > 0 && (
					<div className="mb-6">
						<div className="mt-4 mb-3 flex items-center">
							<FuseSvgIcon>lucide:paperclip</FuseSvgIcon>
							<Typography className="mx-2 text-lg font-semibold">Attachments</Typography>
						</div>
						<div className="-mx-4 flex flex-col flex-wrap sm:flex-row">
							{cardForm.attachments.map((item) => (
								<CardAttachment
									item={item}
									card={cardForm}
									makeCover={() => {
										setValue('attachmentCoverId', item.id);
									}}
									removeCover={() => {
										setValue('attachmentCoverId', '');
									}}
									removeAttachment={() => {
										setValue('attachments', _.reject(cardForm.attachments, { id: item.id }));
									}}
									key={item.id}
								/>
							))}
						</div>
					</div>
				)}

				{cardForm.checklists &&
					cardForm.checklists.map((checklist, index) => (
						<CardChecklist
							key={checklist.id}
							checklist={checklist}
							index={index}
							onCheckListChange={(item, itemIndex) => {
								setValue(
									'checklists',
									setIn(cardForm.checklists, `[${itemIndex}]`, item) as ScrumboardChecklist[]
								);
							}}
							onRemoveCheckList={() => {
								setValue('checklists', _.reject(cardForm.checklists, { id: checklist.id }));
							}}
						/>
					))}

				<div className="mb-6">
					<div className="mt-4 mb-3 flex items-center">
						<FuseSvgIcon>lucide:message-square-text</FuseSvgIcon>
						<Typography className="mx-2 text-lg font-semibold">Comment</Typography>
					</div>
					<div>
						<CardComment
							onCommentAdd={(comment) =>
								setValue('activities', [comment, ...cardForm.activities] as ScrumboardComment[])
							}
						/>
					</div>
				</div>

				<Controller
					name="activities"
					control={control}
					defaultValue={[]}
					render={({ field: { value } }) => (
						<div>
							{value.length > 0 && (
								<div className="mb-6">
									<div className="mt-4 flex items-center">
										<FuseSvgIcon>lucide:clipboard-list</FuseSvgIcon>
										<Typography className="mx-2 text-lg font-semibold">Activity</Typography>
									</div>
									<List>
										{value.map((item) => (
											<CardActivity
												item={item}
												key={item.id}
											/>
										))}
									</List>
								</div>
							)}
						</div>
					)}
				/>
			</div>

			<div className="sticky top-0 order-first flex items-start sm:order-last">
				<Box
					className="flex w-full flex-row items-center overflow-hidden rounded-lg border-1 sm:flex-col"
					sx={{ backgroundColor: 'background.default' }}
				>
					<IconButton
						className="order-last rounded-none sm:order-first"
						color="inherit"
						onClick={() => closeCardDialog()}
						size="large"
					>
						<FuseSvgIcon>lucide:x</FuseSvgIcon>
					</IconButton>
					<div className="flex flex-1 flex-row items-center sm:flex-col sm:items-start">
						<Controller
							name="dueDate"
							control={control}
							render={({ field: { onChange, value } }) => (
								<DueMenu
									onDueChange={onChange}
									onRemoveDue={() => onChange(null)}
									dueDate={value}
								/>
							)}
						/>

						<Controller
							name="labels"
							control={control}
							defaultValue={[]}
							render={({ field: { onChange, value } }) => (
								<LabelsMenu
									onToggleLabel={(labelId) => onChange(_.xor(value, [labelId]))}
									labels={value}
								/>
							)}
						/>

						<Controller
							name="memberIds"
							control={control}
							defaultValue={[]}
							render={({ field: { onChange, value } }) => (
								<MembersMenu
									onToggleMember={(memberId) => onChange(_.xor(value, [memberId]))}
									memberIds={value}
								/>
							)}
						/>

						<Controller
							name="attachments"
							control={control}
							defaultValue={[]}
							render={() => (
								<IconButton
									size="large"
									className="rounded-none"
								>
									<FuseSvgIcon>lucide:paperclip</FuseSvgIcon>
								</IconButton>
							)}
						/>

						<Controller
							name="checklists"
							control={control}
							defaultValue={[]}
							render={({ field: { onChange } }) => (
								<CheckListMenu
									onAddCheckList={(newList) => onChange([...cardForm.checklists, newList])}
								/>
							)}
						/>

						<OptionsMenu
							onRemoveCard={() => {
								removeCard(card.id).then(() => {
									updateBoard({
										...board,
										lists: board.lists.map((list) =>
											list.id === card.listId
												? {
														...list,
														cards: list.cards.filter((id) => id !== card.id)
													}
												: list
										)
									});
									closeCardDialog();
									enqueueSnackbar('Card Removed', {
										variant: 'success'
									});
								});
							}}
						/>
					</div>
				</Box>
			</div>
		</DialogContent>
	);
}

export default BoardCardForm;
