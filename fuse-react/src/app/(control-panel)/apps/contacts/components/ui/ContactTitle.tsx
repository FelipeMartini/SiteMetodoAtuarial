import { useContact } from '../../api/hooks/contacts/useContact';

type ContactTitleProps = {
	contactId?: string;
};

function ContactTitle(props: ContactTitleProps) {
	const { contactId } = props;
	const { data: contact } = useContact(contactId);

	return contact?.name || 'Contact';
}

export default ContactTitle;
