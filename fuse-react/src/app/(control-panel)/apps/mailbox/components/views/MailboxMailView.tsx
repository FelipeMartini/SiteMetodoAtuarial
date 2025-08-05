'use client';

import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import MailLabel from '../ui/mail/MailLabel';
import MailToolbar from '../ui/mail/MailToolbar';
import MailAttachment from '../ui/MailAttachment';
import MailInfo from '../ui/mail/MailInfo';
import { useMailboxMail } from '../../api/hooks/mails/useMailboxMail';
import SelectMailMessage from '../ui/SelectMailMessage';

/**
 * The mail details.
 */
function MailboxMailView() {
	const { data: mail, isLoading, status } = useMailboxMail();

	if (isLoading) {
		return <FuseLoading />;
	}

	if (status === 'pending' || !mail) {
		return <SelectMailMessage />;
	}

	return (
		<>
			<div className="relative z-10 flex w-full shrink-0 flex-col">
				<MailToolbar />

				<div className="flex flex-wrap items-center px-6 py-5">
					<div className="my-1 mr-4 flex flex-auto text-2xl">{mail.subject}</div>
					{mail.labels && mail.labels.length > 0 && (
						<div className="-mx-1 flex flex-wrap items-center justify-start">
							{mail.labels.map((labelId) => (
								<MailLabel
									className="m-1"
									key={labelId}
									labelId={labelId}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			<Box className="flex flex-auto shrink-0 flex-col lg:shrink lg:overflow-y-auto">
				<div className="flex flex-col px-6">
					<div className="flex w-full items-start">
						<Avatar src={mail?.from?.avatar} />

						<div className="ml-4 min-w-0">
							<Typography className="truncate font-semibold">
								{mail.from.contact.split('<')[0].trim()}
							</Typography>

							<div className="mt-0.5 flex items-center leading-5">
								<div>to</div>
								<div className="mx-1 font-semibold">me</div>
								{(mail.cc?.length ?? 0) + (mail.bcc?.length ?? 0) > 0 && (
									<div>
										<span className="mx-1">and</span>
										<span className="mx-1 font-semibold">
											{(mail.cc?.length ?? 0) + (mail.bcc?.length ?? 0)}
										</span>
										<span className="mx-1 font-semibold">
											{(mail.cc?.length ?? 0) + (mail.bcc?.length ?? 0) === 1
												? 'other'
												: 'others'}
										</span>
									</div>
								)}
								<MailInfo />
							</div>
						</div>
					</div>
					<Typography
						className="mt-8 flex leading-[1.625] whitespace-pre-line"
						variant="body2"
						dangerouslySetInnerHTML={{ __html: mail.content }}
					/>

					{mail.attachments && mail.attachments?.length > 0 && (
						<div className="flex w-full flex-col">
							<div className="mt-12 mb-4 flex items-center">
								<FuseSvgIcon>lucide:paperclip</FuseSvgIcon>
								<div className="mx-2 font-semibold">{mail.attachments.length} Attachments</div>
							</div>

							<div className="flex flex-wrap gap-2">
								{mail.attachments.map((attachment, index) => (
									<MailAttachment
										key={index}
										attachment={attachment}
									/>
								))}
							</div>
						</div>
					)}

					<div className="mt-6 flex w-full flex-wrap gap-2">
						<Button
							color="secondary"
							startIcon={<FuseSvgIcon size={18}>lucide:undo-2</FuseSvgIcon>}
							variant="outlined"
							size="small"
						>
							Reply
						</Button>
						<Button
							color="secondary"
							startIcon={<FuseSvgIcon size={18}>lucide:undo-2</FuseSvgIcon>}
							variant="outlined"
							size="small"
						>
							Reply All
						</Button>

						<Button
							color="secondary"
							startIcon={<FuseSvgIcon size={18}>lucide:chevrons-right</FuseSvgIcon>}
							variant="outlined"
							size="small"
						>
							Forward
						</Button>
					</div>
				</div>
			</Box>
		</>
	);
}

export default MailboxMailView;
