import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MailAttachment from '../ui/MailAttachment';
import { SimpleEditor } from '@/components/tiptap/tiptap-templates/simple/simple-editor';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const schema = z
	.object({
		from: z.object({
			email: z.string().email('You must enter a valid e-mail')
		}),
		to: z.string().email('You must enter a valid e-mail.'),
		cc: z.array(z.string().email('Must be a valid email')),
		bcc: z.array(z.string().email('Must be a valid email')),
		subject: z.string(),
		message: z.string()
	})
	.required();

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
	from: { email: 'johndoe@creapond.com' },
	to: '',
	cc: [],
	bcc: [],
	subject: '',
	message: ''
};

type MailComposeDialogProps = {
	className?: string;
};

/**
 * The mail compose.
 */
function MailComposeDialog(props: MailComposeDialogProps) {
	const { className } = props;
	const [openDialog, setOpenDialog] = useState(false);
	const { handleSubmit, formState, control } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const { t } = useTranslation('mailboxApp');

	function handleOpenDialog() {
		setOpenDialog(true);
	}

	function handleCloseDialog() {
		setOpenDialog(false);
	}

	function handleDiscard() {
		setOpenDialog(false);
	}

	function onSubmit(data: FormType) {
		// eslint-disable-next-line no-console
		console.info(data);
		setOpenDialog(false);
	}

	return (
		<div className={clsx('', className)}>
			<Button
				variant="contained"
				color="secondary"
				className="w-full"
				onClick={handleOpenDialog}
				startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
			>
				{t('COMPOSE')}
			</Button>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="form-dialog-title"
				scroll="body"
				disableRestoreFocus
			>
				<AppBar
					position="static"
					color="primary"
					elevation={0}
				>
					<Toolbar className="flex w-full">
						<Typography
							variant="subtitle1"
							color="inherit"
						>
							New Message
						</Typography>
					</Toolbar>
				</AppBar>

				<form
					noValidate
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col"
				>
					<DialogContent classes={{ root: 'p-4 sm:p-8 flex flex-col gap-4' }}>
						<Controller
							name="from.email"
							control={control}
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="from">From</FormLabel>
									<TextField
										{...field}
										id="from"
										fullWidth
										slotProps={{
											input: {
												readOnly: true
											}
										}}
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="to"
							control={control}
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="to">To</FormLabel>
									<TextField
										{...field}
										autoFocus
										id="to"
										error={!!errors.to}
										helperText={errors?.to?.message}
										fullWidth
										required
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="cc"
							control={control}
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="cc">Cc</FormLabel>
									<TextField
										{...field}
										id="cc"
										fullWidth
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="bcc"
							control={control}
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="bcc">Bcc</FormLabel>
									<TextField
										{...field}
										id="bcc"
										fullWidth
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="subject"
							control={control}
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="subject">Subject</FormLabel>
									<TextField
										{...field}
										id="subject"
										fullWidth
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="message"
							control={control}
							rules={{ required: 'Content is required' }}
							render={({ field }) => (
								<SimpleEditor
									className=""
									{...field}
								/>
							)}
						/>

						<div className="flex flex-wrap gap-2 pt-2">
							<MailAttachment attachment={{ name: 'attachment-1.jpg', size: 350, type: 'jpg' }} />
							<MailAttachment attachment={{ name: 'attachment-2.jpg', size: 350, type: 'jpg' }} />
						</div>
					</DialogContent>

					<DialogActions className="flex flex-col justify-between px-6 py-4 sm:flex-row sm:items-center sm:py-6">
						<div className="flex gap-2">
							<IconButton>
								<FuseSvgIcon>lucide:paperclip</FuseSvgIcon>
							</IconButton>

							<IconButton>
								<FuseSvgIcon>lucide:external-link</FuseSvgIcon>
							</IconButton>

							<IconButton>
								<FuseSvgIcon>lucide:smile</FuseSvgIcon>
							</IconButton>

							<IconButton>
								<FuseSvgIcon>lucide:image</FuseSvgIcon>
							</IconButton>
						</div>

						<div className="mt-4 flex items-center gap-2 sm:mt-0">
							<Button
								variant="outlined"
								color="secondary"
								onClick={handleDiscard}
							>
								Discard
							</Button>
							<Button
								variant="outlined"
								color="secondary"
							>
								Save as draft
							</Button>

							<Button
								variant="contained"
								color="secondary"
								type="submit"
								disabled={_.isEmpty(dirtyFields) || !isValid}
							>
								Send
							</Button>
						</div>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	);
}

export default MailComposeDialog;
