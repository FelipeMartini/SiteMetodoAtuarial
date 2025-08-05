'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import useParams from '@fuse/hooks/useParams';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import useNavigate from '@fuse/hooks/useNavigate';
import ContactsHeader from '../ui/ContactsHeader';
import ContactsList from '../ui/contact-list/ContactsList';
import ContactsSidebarContent from '../ui/ContactsSidebarContent';
import { ContactsAppProvider } from '../../contexts/ContactsAppContext/ContactsAppProvider';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-contentWrapper': {
		paddingTop: 2
	},
	'& .FusePageSimple-content': {
		boxShadow: theme.vars.shadows[2]
	}
}));

type ContactsAppProps = {
	children?: React.ReactNode;
};

/**
 * The ContactsApp page.
 */
function ContactsAppView(props: ContactsAppProps) {
	const { children } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const pageLayout = useRef(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	useEffect(() => {
		setRightSidebarOpen(!!routeParams.contactId);
	}, [routeParams]);

	return (
		<Root
			header={<ContactsHeader />}
			content={<ContactsList />}
			ref={pageLayout}
			rightSidebarProps={{
				content: <ContactsSidebarContent>{children}</ContactsSidebarContent>,
				open: rightSidebarOpen,
				onClose: () => navigate('/apps/contacts'),
				width: 640,
				variant: 'temporary'
			}}
			scroll={isMobile ? 'page' : 'content'}
		/>
	);
}

function ContactsAppWrapper(props: { children?: React.ReactNode }) {
	return (
		<ContactsAppProvider>
			<ContactsAppView {...props} />
		</ContactsAppProvider>
	);
}

export default ContactsAppWrapper;
