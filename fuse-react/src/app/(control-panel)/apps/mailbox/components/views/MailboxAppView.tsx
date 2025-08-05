'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import '../../i18n';
import { styled } from '@mui/material/styles';
import { MailboxAppProvider } from '../../contexts/MailboxAppContext/MailboxAppProvider';
import MailboxSidebarView from '@/app/(control-panel)/apps/mailbox/components/views/MailboxSidebarView';
import MailboxMailView from '@/app/(control-panel)/apps/mailbox/components/views/MailboxMailView';
import { useMailboxAppContext } from '../../contexts/MailboxAppContext/useMailboxAppContext';
import useThemeMediaQuery from '../../../../../../@fuse/hooks/useThemeMediaQuery';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-contentWrapper': {
		paddingTop: 2,
		paddingLeft: 2
	},
	'& .FusePageSimple-content': {
		boxShadow: theme.vars.shadows[2],
		borderRadius: '12px 0 0 0',
		[theme.breakpoints.down('md')]: {
			borderRadius: '12px 12px 0 0'
		},
		backgroundColor: theme.vars.palette.background.paper
	},
	'& .FusePageSimple-sidebarWrapper': {
		border: 'none'
	},
	'& .FusePageSimple-leftSidebar .FusePageSimple-sidebarContent': {
		backgroundColor: theme.vars.palette.background.default
	},
	'& .FusePageSimple-rightSidebar': {
		borderLeft: `1px solid ${theme.vars.palette.divider}`,
		boxShadow: theme.vars.shadows[2],
		marginTop: 2
	}
}));

type MailboxAppViewProps = {
	children: React.ReactNode;
};

/**
 * The mailbox app.
 */
function MailboxAppView(props: MailboxAppViewProps) {
	const { children } = props;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { leftSidebarOpen, setLeftSidebarOpen, rightSidebarOpen, setRightSidebarOpen } = useMailboxAppContext();

	return (
		<Root
			content={children}
			leftSidebarProps={{
				content: <MailboxSidebarView />,
				open: leftSidebarOpen,
				onClose: () => setLeftSidebarOpen(false),
				width: 240
			}}
			rightSidebarProps={{
				content: <MailboxMailView />,
				open: rightSidebarOpen,
				onClose: () => setRightSidebarOpen(false)
			}}
			scroll={isMobile ? 'page' : 'content'}
		/>
	);
}

const MailboxAppWrapper = (props: MailboxAppViewProps) => (
	<MailboxAppProvider>
		<MailboxAppView {...props} />
	</MailboxAppProvider>
);

export default MailboxAppWrapper;
