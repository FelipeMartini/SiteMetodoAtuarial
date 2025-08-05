'use client';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import _ from 'lodash';
import clsx from 'clsx';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { useEffect } from 'react';
import { usePlanBillingSettings } from '../../api/hooks/billing/usePlanBillingSettings';
import { useUpdatePlanBillingSettings } from '../../api/hooks/billing/useUpdatePlanBillingSettings';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const plans = [
	{
		value: 'basic',
		label: 'Basic',
		details: 'Starter plan for individuals.',
		price: 9
	},
	{
		value: 'team',
		label: 'Team',
		details: 'Collaborate up to 10 people.',
		price: 29
	},
	{
		value: 'enterprise',
		label: 'Enterprise',
		details: 'For bigger businesses.',
		price: 99
	}
];

/**
 * Form Validation Schema
 */
const schema = z.object({
	id: z.string(),
	plan: z.string(),
	cardHolder: z.string(),
	cardNumber: z.string(),
	cardExpiration: z.string(),
	cardCVC: z.string(),
	country: z.string(),
	zip: z.string()
});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
	id: '',
	plan: 'team',
	cardHolder: '',
	cardNumber: '',
	cardExpiration: '',
	cardCVC: '',
	country: '',
	zip: ''
};

function PlanBillingTabView() {
	const { data: planBillingSettings } = usePlanBillingSettings();
	const { mutate: updatePlanBillingSettings } = useUpdatePlanBillingSettings();

	const { control, reset, handleSubmit, formState } = useForm<FormType>({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		reset(planBillingSettings);
	}, [planBillingSettings, reset]);

	/**
	 * Form Submit
	 */
	function onSubmit(formData: FormType) {
		updatePlanBillingSettings({ ...formData, id: formData.id });
	}

	return (
		<div className="w-full max-w-5xl">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-12"
			>
				<div className="flex flex-col gap-4">
					<div className="w-full">
						<Typography className="text-xl font-medium">Change your plan</Typography>
						<Typography color="text.secondary">Upgrade or downgrade your current plan.</Typography>
					</div>
					<div className="grid w-full gap-4 sm:grid-cols-3">
						<div className="sm:col-span-3">
							<Alert severity="info">
								Changing the plan will take effect immediately. You will be charged for the rest of the
								current month.
							</Alert>
						</div>
						<Controller
							name="plan"
							control={control}
							render={({ field }) => (
								<>
									{plans.map((plan) => (
										<Paper
											sx={(theme) => ({
												border: `1px solid ${theme.vars.palette.divider}!important`,
												'&.selected': {
													border: `1px solid ${theme.vars.palette.secondary.main}!important`
												}
											})}
											className={clsx(
												'relative flex flex-1 cursor-pointer flex-col items-start justify-start rounded-md border-3 border-transparent p-6',
												field.value === plan.value ? 'selected' : ''
											)}
											onClick={() => field.onChange(plan.value)}
											key={plan.value}
										>
											{field.value === plan.value && (
												<FuseSvgIcon
													className="absolute top-0 right-0 mt-3 mr-3"
													color="secondary"
												>
													lucide:circle-check
												</FuseSvgIcon>
											)}
											<Typography className="font-semibold uppercase">{plan.label}</Typography>
											<Typography
												className="mt-1"
												color="text.secondary"
											>
												{plan.details}
											</Typography>
											<div className="flex-auto" />
											<div className="mt-2 flex items-end text-lg">
												<Typography>
													{plan.price.toLocaleString('en-US', {
														style: 'currency',
														currency: 'USD'
													})}
												</Typography>
												<Typography color="text.secondary"> / month</Typography>
											</div>
										</Paper>
									))}
								</>
							)}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="w-full">
						<Typography className="text-xl">Payment Details</Typography>
						<Typography color="text.secondary">
							Update your billing information. Make sure to set your location correctly as it could affect
							your tax rates.
						</Typography>
					</div>
					<div className="grid w-full grid-cols-4 gap-4">
						<div className="col-span-4">
							<Controller
								control={control}
								name="cardHolder"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="cardHolder">Card holder</FormLabel>
										<TextField
											{...field}
											id="cardHolder"
											placeholder="Card holder"
											error={!!errors.cardHolder}
											helperText={errors?.cardHolder?.message}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:circle-user</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="col-span-4 sm:col-span-2">
							<Controller
								control={control}
								name="cardNumber"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="cardNumber">Card number</FormLabel>
										<TextField
											{...field}
											id="cardNumber"
											placeholder="Card number"
											error={!!errors.cardNumber}
											helperText={errors?.cardNumber?.message}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:credit-card</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="col-span-2 sm:col-span-1">
							<Controller
								control={control}
								name="cardExpiration"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="cardExpiration">Expiration date</FormLabel>
										<TextField
											{...field}
											id="cardExpiration"
											placeholder="MM / YY"
											error={!!errors.cardExpiration}
											helperText={errors?.cardExpiration?.message}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:credit-card</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="col-span-2 sm:col-span-1">
							<Controller
								control={control}
								name="cardCVC"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="cardCVC">CVC / CVC2</FormLabel>
										<TextField
											{...field}
											id="cardCVC"
											placeholder="CVC / CVC2"
											error={!!errors.cardCVC}
											helperText={errors?.cardCVC?.message}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:lock</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="col-span-4 sm:col-span-2">
							<Controller
								control={control}
								name="country"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="country">Country</FormLabel>
										<TextField
											{...field}
											id="country"
											placeholder="County"
											error={!!errors.country}
											helperText={errors?.country?.message}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: <FuseSvgIcon color="action">lucide:map</FuseSvgIcon>
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="col-span-4 sm:col-span-2">
							<Controller
								control={control}
								name="zip"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="zip">ZIP / Postal code</FormLabel>
										<TextField
											{...field}
											id="zip"
											placeholder="ZIP / Postal code"
											error={!!errors.zip}
											helperText={errors?.zip?.message}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:hash</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2">
					<Button
						variant="outlined"
						disabled={_.isEmpty(dirtyFields)}
						onClick={() => reset(planBillingSettings)}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						type="submit"
					>
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}

export default PlanBillingTabView;
