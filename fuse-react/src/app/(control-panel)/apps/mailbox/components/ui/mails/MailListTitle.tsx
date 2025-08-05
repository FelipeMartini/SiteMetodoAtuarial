import Typography from '@mui/material/Typography';
import useSelectMailsTitle from '../../../api/hooks/mails/useSelectMailsTitle';

/**
 * The mail list title.
 */
function MailListTitle() {
	const title = useSelectMailsTitle();

	return <Typography className="mx-2 hidden font-semibold uppercase sm:flex">{title}</Typography>;
}

export default MailListTitle;
