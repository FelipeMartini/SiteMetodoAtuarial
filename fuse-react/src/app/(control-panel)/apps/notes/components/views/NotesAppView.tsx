'use client';
import { useEffect, useState, ReactNode } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import LabelsDialog from '../dialogs/labels/LabelsDialog';
import NoteDialog from '../dialogs/note/NoteDialog';
import NewNote from '../ui/NewNote';
import NotesHeader from '../ui/NotesHeader';
import NotesSidebarContent from '../ui/NotesSidebarContent';
import { NotesAppContextProvider } from '../../contexts/NotesAppContext/NotesAppContextProvider';
import usePathname from '@fuse/hooks/usePathname';

type NotesAppType = {
	children?: ReactNode;
};

/**
 * The notes app.
 */
function NotesApp(props: NotesAppType) {
	const { children } = props;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	const pathname = usePathname();

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) {
			setLeftSidebarOpen(false);
		}
	}, [pathname, isMobile]);

	return (
		<FusePageCarded
			header={<NotesHeader onSetSidebarOpen={setLeftSidebarOpen} />}
			content={
				<div className="flex w-full flex-col items-center p-4 md:p-6">
					<div className="flex w-full justify-center pb-4">
						<NewNote />
					</div>
					{children}
					<NoteDialog />
					<LabelsDialog />
				</div>
			}
			leftSidebarProps={{
				open: leftSidebarOpen,
				onClose: () => {
					setLeftSidebarOpen(false);
				},
				content: <NotesSidebarContent />
			}}
			scroll={isMobile ? 'page' : 'content'}
		/>
	);
}

const NotesAppWrapper = (props: NotesAppType) => {
	return (
		<NotesAppContextProvider>
			<NotesApp {...props} />
		</NotesAppContextProvider>
	);
};

export default NotesAppWrapper;
