import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

type ContactsSidebarContentType = {
	children: React.ReactNode;
};

/**
 * The contacts sidebar content.
 */
function ContactsSidebarContent(props: ContactsSidebarContentType) {
	const { children } = props;

	return (
		<div className="flex max-h-screen min-h-0 max-w-full flex-auto flex-col">
			<IconButton
				className="absolute top-0 right-0 z-10 mx-8 my-4"
				sx={{
					backgroundColor: 'primary.light',
					color: 'primary.contrastText',
					'&:hover': {
						backgroundColor: 'primary.main',
						color: 'primary.contrastText'
					}
				}}
				component={NavLinkAdapter}
				to="/apps/contacts"
			>
				<FuseSvgIcon>lucide:x</FuseSvgIcon>
			</IconButton>
			{children}
		</div>
	);
}

export default ContactsSidebarContent;
