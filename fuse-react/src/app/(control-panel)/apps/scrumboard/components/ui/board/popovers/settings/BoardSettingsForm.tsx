import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useDebounce, useDeepCompareEffect } from '@fuse/hooks';
import { PartialDeep } from 'type-fest';
import ListItemButton from '@mui/material/ListItemButton';
import useNavigate from '@fuse/hooks/useNavigate';
import { ScrumboardBoard } from '../../../../../api/types';
import useParams from '@fuse/hooks/useParams';
import { useGetScrumboardBoard } from '../../../../../api/hooks/boards/useGetScrumboardBoard';
import { useUpdateScrumboardBoard } from '../../../../../api/hooks/boards/useUpdateScrumboardBoard';
import { useDeleteScrumboardBoard } from '../../../../../api/hooks/boards/useDeleteScrumboardBoard';

type BoardSettingsFormProps = {
	onClose: () => void;
};

/**
 * The board settings form component.
 */
function BoardSettingsForm(props: BoardSettingsFormProps) {
	const { onClose } = props;
	const navigate = useNavigate();
	const routeParams = useParams<{ boardId: string }>();
	const { boardId } = routeParams;

	const { data: board } = useGetScrumboardBoard(boardId);
	const { mutate: updateBoard } = useUpdateScrumboardBoard();
	const { mutateAsync: deleteBoard } = useDeleteScrumboardBoard();

	const { watch, control, reset } = useForm({
		mode: 'onChange',
		defaultValues: board?.settings
	});

	const boardSettingsForm = watch();
	const boardSettings = useMemo(() => board?.settings, [board]);

	const updateBoardData = useDebounce((data: PartialDeep<ScrumboardBoard>) => {
		updateBoard({ ...board, settings: { ...boardSettings, ...data.settings } });
	}, 600);

	useDeepCompareEffect(() => {
		if (_.isEmpty(boardSettingsForm) || !boardSettings) {
			return;
		}

		if (!_.isEqual(boardSettings, boardSettingsForm)) {
			updateBoardData({ settings: boardSettingsForm });
		}
	}, [boardSettings, boardSettingsForm, updateBoardData]);

	useEffect(() => {
		if (!boardSettings) {
			return;
		}

		reset(boardSettings);
	}, [boardSettings, reset]);

	if (_.isEmpty(boardSettingsForm)) {
		return null;
	}

	return (
		<div className="relative w-full">
			<IconButton
				className="absolute top-0 right-0 z-10 m-1"
				onClick={onClose}
				color="inherit"
				size="small"
			>
				<FuseSvgIcon>lucide:x</FuseSvgIcon>
			</IconButton>

			<List className="pt-8">
				<ListItem>
					<ListItemIcon>
						<FuseSvgIcon>lucide:image</FuseSvgIcon>
					</ListItemIcon>
					<ListItemText primary="Card Cover Images" />
					<Controller
						name="cardCoverImages"
						control={control}
						render={({ field: { onChange, value } }) => (
							<Switch
								onChange={(ev) => {
									onChange(ev.target.checked);
								}}
								checked={value}
							/>
						)}
					/>
				</ListItem>

				<Controller
					name="subscribed"
					control={control}
					render={({ field: { onChange, value } }) => (
						<ListItem>
							<ListItemIcon>
								<FuseSvgIcon>{value ? 'lucide:eye' : 'lucide:eye-off'}</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Subscribe" />
							<Switch
								onChange={(ev) => {
									onChange(ev.target.checked);
								}}
								checked={value}
							/>
						</ListItem>
					)}
				/>

				<ListItemButton
					className="px-4"
					onClick={() => {
						deleteBoard(board?.id).then(() => {
							navigate(`/apps/scrumboard/boards`);
						});
					}}
				>
					<ListItemIcon>
						<FuseSvgIcon>lucide:trash</FuseSvgIcon>
					</ListItemIcon>
					<ListItemText primary="Delete Board" />
				</ListItemButton>
			</List>
		</div>
	);
}

export default BoardSettingsForm;
