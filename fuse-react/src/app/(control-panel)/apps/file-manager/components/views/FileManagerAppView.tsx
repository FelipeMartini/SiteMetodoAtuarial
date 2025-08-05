'use client';

import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import DetailSidebarContent from '../ui/DetailSidebarContent';
import FileManagerHeader from '../ui/FileManagerHeader';
import { FileManagerAppProvider } from '../../contexts/FileManagerAppContext/FileManagerAppProvider';
import { useFileManagerAppContext } from '../../contexts/FileManagerAppContext/useFileManagerAppContext';

type FileManagerAppViewProps = {
	children?: React.ReactNode;
};

/**
 * The file manager app.
 */
function FileManagerAppView(props: FileManagerAppViewProps) {
	const { children } = props;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { selectedItemId } = useFileManagerAppContext();

	return (
		<FusePageCarded
			header={<FileManagerHeader />}
			content={children}
			rightSidebarProps={{
				open: !!selectedItemId,
				content: <DetailSidebarContent />,
				width: 400
			}}
			scroll={isMobile ? 'page' : 'content'}
		/>
	);
}

const FileManagerAppWrapper = (props: FileManagerAppViewProps) => {
	return (
		<FileManagerAppProvider>
			<FileManagerAppView {...props} />
		</FileManagerAppProvider>
	);
};

export default FileManagerAppWrapper;
