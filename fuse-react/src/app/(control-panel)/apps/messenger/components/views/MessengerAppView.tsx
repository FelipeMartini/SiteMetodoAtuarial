'use client';

import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

import FusePageSimple from '@fuse/core/FusePageSimple';
import MainSidebar from '../sidebars/main/MainSidebar';
import ContactSidebar from '../sidebars/contact/ContactSidebar';
import UserSidebar from '../sidebars/user/UserSidebar';
import { MessengerAppContextProvider } from '../../contexts/MessengerAppContext/MessengerAppContextProvider';
import { useMessengerAppContext } from '../../contexts/MessengerAppContext/useMessengerAppContext';
import Paper from '@mui/material/Paper';

const drawerWidth = 400;

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
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
	'& .FusePageSimple-sidebarContent': {
		backgroundColor: theme.vars.palette.background.default
	}
}));

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
	'& .MuiDrawer-paper': {
		width: drawerWidth,
		maxWidth: '100%',
		overflow: 'hidden',
		[theme.breakpoints.up('md')]: {
			position: 'relative'
		}
	}
}));

type MessengerAppViewProps = {
	children?: React.ReactNode;
};

/**
 * The chat app.
 */
function MessengerAppView(props: MessengerAppViewProps) {
	const { children } = props;
	const {
		mainSidebarOpen,
		setMainSidebarOpen,
		contactSidebarOpen,
		setContactSidebarOpen,
		userSidebarOpen,
		setUserSidebarOpen
	} = useMessengerAppContext();

	return (
		<>
			<Root
				content={
					<Paper className="flex min-h-0 flex-auto flex-col overflow-hidden rounded-tr-none">
						{children}
					</Paper>
				}
				leftSidebarProps={{
					content: <MainSidebar />,
					open: mainSidebarOpen,
					onClose: () => {
						setMainSidebarOpen(false);
					},
					width: 400
				}}
				rightSidebarProps={{
					content: <ContactSidebar />,
					open: Boolean(contactSidebarOpen),
					onClose: () => {
						setContactSidebarOpen(null);
					},
					width: 400
				}}
				scroll="content"
			/>
			<StyledSwipeableDrawer
				className="absolute z-9999 h-full"
				variant="temporary"
				anchor="left"
				open={userSidebarOpen}
				onOpen={() => {}}
				onClose={() => setUserSidebarOpen(false)}
				classes={{
					paper: 'absolute left-0'
				}}
				style={{ position: 'absolute' }}
				ModalProps={{
					keepMounted: false,
					disablePortal: true,
					BackdropProps: {
						classes: {
							root: 'absolute'
						}
					}
				}}
			>
				<UserSidebar />
			</StyledSwipeableDrawer>
		</>
	);
}

const MessengerAppWrapper = (props: MessengerAppViewProps) => {
	return (
		<MessengerAppContextProvider>
			<MessengerAppView {...props} />
		</MessengerAppContextProvider>
	);
};

export default MessengerAppWrapper;
