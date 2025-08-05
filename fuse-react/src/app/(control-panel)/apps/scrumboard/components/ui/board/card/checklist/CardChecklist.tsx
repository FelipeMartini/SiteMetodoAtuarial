import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { MouseEvent, useEffect, useRef, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CardAddChecklistItem from './CardAddChecklistItem';
import CardChecklistItem from './CardChecklistItem';
import CardChecklistName, { CardChecklistHandle } from './CardChecklistName';
import { ScrumboardChecklist } from '../../../../../api/types';
import setIn from '@/utils/setIn';

type CardChecklistProps = {
	onCheckListChange: (checklist: ScrumboardChecklist, index: number) => void;
	checklist: ScrumboardChecklist;
	index: number;
	onRemoveCheckList: () => void;
};

/**
 * The card checklist component.
 */
function CardChecklist(props: CardChecklistProps) {
	const { onCheckListChange, checklist, index, onRemoveCheckList } = props;
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const checkListNameRef = useRef<CardChecklistHandle | null>(null);

	const { watch, control } = useForm({ mode: 'onChange', defaultValues: checklist });
	const form = watch();

	useEffect(() => {
		if (!_.isEqual(form, checklist)) {
			onCheckListChange(form, index);
		}
	}, [form, index, onCheckListChange, checklist]);

	function handleOpenNameForm(ev: React.MouseEvent<HTMLElement>) {
		handleMenuClose();

		if (checkListNameRef.current) {
			checkListNameRef.current.openForm(ev);
		}
	}

	function handleMenuOpen(event: MouseEvent<HTMLButtonElement>) {
		setAnchorEl(event.currentTarget);
	}

	function handleMenuClose() {
		setAnchorEl(null);
	}

	function checkItemsChecked() {
		return _.sum(form.checkItems.map((x) => (x.checked ? 1 : 0)));
	}

	if (!form) {
		return null;
	}

	return (
		<div className="mb-6">
			<div className="mt-4 mb-3 flex items-center justify-between">
				<div className="flex items-center">
					<FuseSvgIcon>lucide:circle-check</FuseSvgIcon>
					<Controller
						name="name"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => (
							<CardChecklistName
								name={value}
								onNameChange={(val) => onChange(val)}
								ref={checkListNameRef}
							/>
						)}
					/>
				</div>
				<div>
					<IconButton
						aria-owns={anchorEl ? 'actions-menu' : null}
						aria-haspopup="true"
						onClick={handleMenuOpen}
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
						<MenuItem onClick={onRemoveCheckList}>
							<ListItemIcon className="min-w-9">
								<FuseSvgIcon>lucide:trash</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Remove Checklist" />
						</MenuItem>
						<MenuItem onClick={handleOpenNameForm}>
							<ListItemIcon className="min-w-9">
								<FuseSvgIcon>lucide:pencil</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary="Rename Checklist" />
						</MenuItem>
					</Menu>
				</div>
			</div>

			<div>
				<div className="-mx-1.5 flex items-center">
					<Typography className="mx-1.5 flex font-semibold">
						{`${checkItemsChecked()} / ${form.checkItems.length}`}
					</Typography>
					<LinearProgress
						className="mx-1.5 flex flex-1"
						variant="determinate"
						color="secondary"
						value={(100 * checkItemsChecked()) / form.checkItems.length}
					/>
				</div>
				<Controller
					name="checkItems"
					control={control}
					defaultValue={[]}
					render={({ field: { onChange, value } }) => (
						<List>
							{value.map((checkItem, _index) => (
								<CardChecklistItem
									item={checkItem}
									key={checkItem.id}
									index={_index}
									onListItemChange={(item, itemIndex) => {
										onChange(setIn(value, `[${itemIndex}]`, item));
									}}
									onListItemRemove={() => {
										onChange(_.reject(value, { id: checkItem.id }));
									}}
								/>
							))}
							<CardAddChecklistItem onListItemAdd={(item) => onChange([...value, item])} />
						</List>
					)}
				/>
			</div>
		</div>
	);
}

export default CardChecklist;
