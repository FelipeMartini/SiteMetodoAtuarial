'use client';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

type formValuesType = { name: string; email: string; subject: string; message: string };

const defaultValues = { name: '', email: '', subject: '', message: '' };

const schema = z.object({
	name: z.string().nonempty('You must enter a name'),
	subject: z.string().nonempty('You must enter a subject'),
	message: z.string().nonempty('You must enter a message'),
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email')
});

/**
 * The help center support.
 */
function HelpCenterSupport() {
	const { control, handleSubmit, watch, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	function onSubmit(data: formValuesType) {
		// eslint-disable-next-line no-console
		console.log(data);
	}

	if (_.isEmpty(form)) {
		return null;
	}

	return (
		<div className="container flex flex-col items-center p-4 sm:p-8">
			<div className="flex w-full max-w-6xl flex-col">
				<PageBreadcrumb className="mb-2" />
				<div className="text-3xl leading-[1.25] font-bold tracking-tight">Contact support</div>

				<Paper className="mt-6 max-w-2xl rounded-xl">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="p-6"
					>
						<div className="mb-6">
							<Typography className="text-2xl font-bold tracking-tight">Submit your request</Typography>
							<Typography color="text.secondary">
								Your request will be processed and our support staff will get back to you in 24 hours.
							</Typography>
						</div>
						<div className="flex flex-col gap-4">
							<Controller
								control={control}
								name="name"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="name">Name</FormLabel>
										<TextField
											id="name"
											{...field}
											placeholder="Name"
											error={!!errors.name}
											helperText={errors?.name?.message}
											required
											fullWidth
										/>
									</FormControl>
								)}
							/>

							<Controller
								control={control}
								name="email"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="email">Email</FormLabel>
										<TextField
											id="email"
											{...field}
											placeholder="Email"
											fullWidth
											error={!!errors.email}
											helperText={errors?.email?.message}
											required
										/>
									</FormControl>
								)}
							/>

							<Controller
								control={control}
								name="subject"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="subject">Subject</FormLabel>
										<TextField
											{...field}
											id="subject"
											placeholder="Subject"
											fullWidth
											error={!!errors.subject}
											helperText={errors?.subject?.message}
											required
										/>
									</FormControl>
								)}
							/>

							<Controller
								name="message"
								control={control}
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="message">Message</FormLabel>
										<TextField
											{...field}
											multiline
											minRows={4}
											error={!!errors.message}
											helperText={errors?.message?.message}
											required
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="mt-8 flex items-center justify-end">
							<Button className="mx-2">Cancel</Button>
							<Button
								className="mx-2"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								type="submit"
							>
								Save
							</Button>
						</div>
					</form>
				</Paper>
			</div>
		</div>
	);
}

export default HelpCenterSupport;
