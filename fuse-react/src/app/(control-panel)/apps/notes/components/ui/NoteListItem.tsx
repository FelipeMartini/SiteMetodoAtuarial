import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NoteLabel from './NoteLabel';
import NoteReminderLabel from './NoteReminderLabel';
import setDescriptionStyle from '../../lib/utils/setDescriptionStyle';
import { NotesNote } from '../../api/types';
import { useNotesAppContext } from '../../contexts/NotesAppContext/useNotesAppContext';

type NoteListItemProps = {
	note: NotesNote;
	className?: string;
};

/**
 * The note list item.
 */
function NoteListItem(props: NoteListItemProps) {
	const { note, className } = props;

	const { variateDesc, openNoteDialog } = useNotesAppContext();

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.1 } }}
		>
			<Card
				className={clsx('cursor-pointer', className)}
				onClick={() => openNoteDialog(note.id)}
				sx={{
					backgroundColor: 'background.default'
				}}
				elevation={0}
			>
				{note.image && note.image !== '' && (
					<img
						src={note.image}
						className="block w-full"
						alt="note"
					/>
				)}

				{note.title && note.title !== '' && (
					<Typography className="my-3 px-4 text-base font-semibold">{note.title}</Typography>
				)}

				{note.content && note.content !== '' && (
					<Typography
						className="my-3 px-4"
						component="div"
					>
						<div
							className={clsx('w-full break-words', variateDesc ? 'font-medium' : 'text-base')}
							ref={(el) => {
								setTimeout(() => setDescriptionStyle(note.content, el, Boolean(variateDesc)));
							}}
						>
							{note.content}
						</div>
					</Typography>
				)}

				{note.tasks && note.tasks.length > 0 && (
					<ul className="my-3 flex flex-wrap px-4">
						{note.tasks.map((item) => (
							<li
								key={item.id}
								className="flex w-full items-center"
							>
								<FuseSvgIcon
									color={item.completed ? 'secondary' : 'disabled'}
									size={16}
								>
									lucide:circle-check
								</FuseSvgIcon>
								<Typography
									className={clsx('text-md mx-2 truncate', item.completed && 'line-through')}
									color={item.completed ? 'text.secondary' : 'inherit'}
								>
									{item.content}
								</Typography>
							</li>
						))}
					</ul>
				)}

				{(note.labels.length > 0 || note.reminder) && (
					<div className="-mx-0.5 my-3 flex w-full flex-wrap px-4">
						{note.reminder && (
							<NoteReminderLabel
								className="mx-0.5 mt-1 max-w-full"
								date={note.reminder}
							/>
						)}
						{note.labels.map((id) => (
							<NoteLabel
								id={id}
								key={id}
								className="mx-0.5 mt-1 max-w-full"
								linkable
							/>
						))}
					</div>
				)}
			</Card>
		</motion.div>
	);
}

export default NoteListItem;
