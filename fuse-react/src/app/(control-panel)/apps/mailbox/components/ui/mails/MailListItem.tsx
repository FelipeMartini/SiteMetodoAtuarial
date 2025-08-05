import _ from 'lodash';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns/format';
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import { NavLinkAdapterPropsType } from '@fuse/core/NavLinkAdapter/NavLinkAdapter';
import useParams from '@fuse/hooks/useParams';
import { MailboxMail } from '../../../api/types';
import { useMailboxAppContext } from '../../../contexts/MailboxAppContext/useMailboxAppContext';

const StyledListItem = styled(ListItemButton)<ListItemButtonProps & NavLinkAdapterPropsType & { unread: number }>(
	({ theme }) => ({
		background: theme.vars.palette.background.default,
		borderBottom: `1px solid ${theme.vars.palette.divider}`,
		'&.selected': {
			'&::after': {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				display: 'block',
				height: '100%',
				width: 3,
				backgroundColor: theme.vars.palette.primary.main
			}
		},
		variants: [
			{
				props: ({ unread }) => unread,
				style: {
					background: theme.vars.palette.background.paper
				}
			}
		]
	})
);

type MailListItemProps = {
	mail: MailboxMail;
};

/**
 * The mail list item.
 */
function MailListItem(props: MailListItemProps) {
	const { mail } = props;
	const { selectedMailIds, toggleInSelectedMails } = useMailboxAppContext();
	const routerParams = useParams();
	const { category, subCategory } = routerParams;
	const checked = selectedMailIds.length > 0 && selectedMailIds.find((id) => id === mail.id) !== undefined;

	return (
		<StyledListItem
			component={NavLinkAdapter}
			activeClassName="selected"
			to={`/apps/mailbox/${category}/${subCategory}/${mail.id}`}
			dense
			selected={checked}
			unread={mail.unread ? 1 : 0}
			className="relative w-full items-start px-0 py-5 md:px-2"
		>
			<Checkbox
				tabIndex={-1}
				disableRipple
				checked={checked}
				onClick={(ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					toggleInSelectedMails(mail.id);
				}}
				size="small"
			/>
			<div className="flex min-w-0 flex-auto flex-col">
				<div className="flex w-full items-center gap-1.5">
					<Avatar
						sx={{
							backgroundColor: (_theme) => _theme.vars.palette.primary.main
						}}
						alt={mail.from.email}
						src={mail.from?.avatar}
					>
						{mail.from.contact}
					</Avatar>
					<div className="flex w-full min-w-0 flex-col">
						<div className="flex w-full items-center">
							<Typography className="mr-2 truncate font-semibold">
								{mail.from.contact.split('<')[0].trim()}
							</Typography>

							{mail.important && (
								<FuseSvgIcon
									className="mr-3 text-red-500 dark:text-red-600"
									size={16}
								>
									lucide:circle-alert
								</FuseSvgIcon>
							)}

							<Typography
								className="text-md ml-auto text-right whitespace-nowrap"
								color="text.secondary"
							>
								{format(new Date(mail.date), 'LLL dd')}
							</Typography>
						</div>
						<div className="mt-1 flex w-full items-center">
							<span className="truncate leading-4">{mail.subject}</span>
							{((mail.attachments && mail.attachments.length > 0) || mail.starred) && (
								<div className="ml-auto flex pl-2">
									<FuseSvgIcon>lucide:paperclip</FuseSvgIcon>

									{mail.starred && (
										<FuseSvgIcon
											className="ml-1 flex justify-center text-orange-500 dark:text-orange-400"
											size={16}
										>
											lucide:star
										</FuseSvgIcon>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
				<Typography
					color="text.secondary"
					className="mt-2 line-clamp-2 leading-[1.5]"
				>
					{_.truncate(mail.content.replace(/<(?:.|\n)*?>/gm, ''), { length: 180 })}
				</Typography>
			</div>
		</StyledListItem>
	);
}

export default MailListItem;
