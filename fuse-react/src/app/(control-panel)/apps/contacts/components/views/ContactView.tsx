'use client';

import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import useParams from '@fuse/hooks/useParams';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import { format } from 'date-fns/format';
import _ from 'lodash';
import useNavigate from '@fuse/hooks/useNavigate';
import { useContact } from '../../api/hooks/contacts/useContact';
import { useCountries } from '../../api/hooks/countries/useCountries';
import { useTags } from '../../api/hooks/tags/useTags';
import ContactForm from '../forms/ContactForm';
import { useSnackbar } from 'notistack';

/**
 * The contact view.
 */
function ContactView() {
	const { data: countries } = useCountries();
	const { data: tags } = useTags();
	const routeParams = useParams<{ contactId: string }>();
	const isNew = routeParams.contactId === 'new';
	const { contactId } = routeParams;
	const { data: contact, isLoading, isError } = useContact(contactId);
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();

	function getCountryByIso(iso: string) {
		return countries?.find((country) => country.iso === iso);
	}

	if (isNew) {
		return <ContactForm isNew />;
	}

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError) {
		setTimeout(() => {
			navigate('/apps/contacts');
			enqueueSnackbar('NOT FOUND', {
				variant: 'error'
			});
		}, 0);

		return null;
	}

	if (!contact) {
		return null;
	}

	return (
		<>
			<div className="relative flex flex-auto flex-col items-center overflow-y-auto">
				<Box
					className="relative min-h-40 w-full px-8 sm:min-h-48 sm:px-12"
					sx={{
						backgroundColor: 'background.default'
					}}
				>
					{contact.background && (
						<img
							className="absolute inset-0 h-full w-full object-cover"
							src={contact.background}
							alt="user background"
						/>
					)}
				</Box>
				<div className="px-6 sm:px-12">
					<div className="-mt-16 flex flex-auto items-end">
						<Avatar
							sx={{
								borderWidth: 4,
								borderStyle: 'solid',
								borderColor: 'background.paper',
								backgroundColor: 'background.default',
								color: 'text.secondary'
							}}
							className="text-16 h-32 w-32 font-bold"
							src={contact.avatar}
							alt={contact.name}
						>
							{contact?.name?.charAt(0)}
						</Avatar>
						<div className="mb-1 ml-auto flex items-center">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to={`/apps/contacts/${contactId}/edit`}
							>
								<FuseSvgIcon>lucide:square-pen</FuseSvgIcon>
								<span className="mx-2">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-3 truncate text-4xl font-bold">{contact.name}</Typography>

					<div className="mt-2 flex flex-wrap items-center">
						{contact?.tags?.map((id) => (
							<Chip
								key={id}
								label={_.find(tags, { id })?.title}
								className="mr-3 mb-3"
								size="small"
							/>
						))}
					</div>

					<Divider className="mt-4 mb-6" />

					<div className="flex flex-col gap-8">
						{contact.title && (
							<div className="flex items-center">
								<FuseSvgIcon>lucide:briefcase</FuseSvgIcon>
								<div className="ml-6 leading-6">{contact.title}</div>
							</div>
						)}

						{contact.company && (
							<div className="flex items-center">
								<FuseSvgIcon>lucide:building-2</FuseSvgIcon>
								<div className="ml-6 leading-6">{contact.company}</div>
							</div>
						)}

						{contact?.emails?.length && contact.emails.some((item) => item.email?.length > 0) && (
							<div className="flex">
								<FuseSvgIcon>lucide:mail</FuseSvgIcon>
								<div className="ml-6 flex min-w-0 flex-col gap-1">
									{contact.emails.map(
										(item) =>
											item.email !== '' && (
												<div
													className="flex items-center leading-6"
													key={item.email}
												>
													<a
														className="text-primary-500 hover:underline"
														href={`mailto: ${item.email}`}
														target="_blank"
														rel="noreferrer"
													>
														{item.email}
													</a>
													{item.label && (
														<Typography
															className="text-md truncate"
															color="text.secondary"
														>
															<span className="mx-2">&bull;</span>
															<span className="font-medium">{item.label}</span>
														</Typography>
													)}
												</div>
											)
									)}
								</div>
							</div>
						)}

						{contact?.phoneNumbers &&
							contact?.phoneNumbers?.length &&
							contact.phoneNumbers.some((item) => item.phoneNumber?.length > 0) && (
								<div className="flex">
									<FuseSvgIcon>lucide:phone</FuseSvgIcon>
									<div className="ml-6 flex min-w-0 flex-col gap-1">
										{contact.phoneNumbers.map(
											(item, index) =>
												item.phoneNumber !== '' && (
													<div
														className="flex items-center leading-6"
														key={index}
													>
														<Box
															className="hidden h-4 w-6 overflow-hidden sm:flex"
															sx={{
																background:
																	"url('/assets/images/apps/contacts/flags.png') no-repeat 0 0",
																backgroundSize: '24px 3876px',
																backgroundPosition: getCountryByIso(item.country)
																	?.flagImagePos
															}}
														/>

														<div className="font-mono sm:ml-3">
															{getCountryByIso(item.country)?.code}
														</div>

														<div className="ml-2.5 font-mono">{item.phoneNumber}</div>

														{item.label && (
															<Typography
																className="text-md truncate"
																color="text.secondary"
															>
																<span className="mx-2">&bull;</span>
																<span className="font-medium">{item.label}</span>
															</Typography>
														)}
													</div>
												)
										)}
									</div>
								</div>
							)}

						{contact.address && (
							<div className="flex items-center">
								<FuseSvgIcon>lucide:map-pin</FuseSvgIcon>
								<div className="ml-6 leading-6">{contact.address}</div>
							</div>
						)}

						{contact.birthday && (
							<div className="flex items-center">
								<FuseSvgIcon>lucide:cake</FuseSvgIcon>
								<div className="ml-6 leading-6">{format(new Date(contact.birthday), 'MMMM d, y')}</div>
							</div>
						)}

						{contact.notes && (
							<div className="flex">
								<FuseSvgIcon>lucide:align-left</FuseSvgIcon>
								<div
									className="prose dark:prose-invert ml-6 max-w-none"
									dangerouslySetInnerHTML={{ __html: contact.notes }}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default ContactView;
