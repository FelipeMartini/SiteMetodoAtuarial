import { Controller, useForm } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import FuseLoading from '@fuse/core/FuseLoading';
import WalletsType from '../../../api/types/WalletsType';
import PricesType from '../../../api/types/PricesType';
import CoinTypes from '../../../api/types/CoinTypes';
import { useGetWidget } from '../../../api/hooks/widgets/useGetWidget';

const actionValues = [
	{ title: 'Buy', value: 'buy' },
	{ title: 'Sell', value: 'sell' }
];

const walletValues = [
	{ title: 'Bitcoin', value: 'btc' },
	{ title: 'Ethereum', value: 'eth' },
	{ title: 'Bitcoin Cash', value: 'bch' },
	{ title: 'XRP', value: 'xrp' }
];

const defaultValues = {
	action: 'buy',
	wallet: 'btc',
	amount: 1,
	amountType: 'usd'
};

/**
 * Form Validation Schema
 */

const schema = z.object({
	action: z.string().min(1, 'You must select a value'),
	wallet: z.string().min(1, 'You must select a value'),
	amount: z.number().min(1, 'You must specify a number value greater than 0'),
	amountType: z.string().min(1, 'You must select a value')
});

type FormType = z.infer<typeof schema>;

/**
 * The buy sell form.
 */
function BuySellForm() {
	const { data: walletsWidget, isLoading: walletsLoading } = useGetWidget<WalletsType>('wallets');
	const { data: pricesWidget, isLoading: pricesLoading } = useGetWidget<PricesType>('prices');

	const isLoading = walletsLoading || pricesLoading;
	const { handleSubmit, reset, control, watch, formState, setValue } = useForm<FormType>({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, errors } = formState;

	const actionValue = watch('action');
	const walletValue = watch('wallet');
	const amountTypeValue = watch('amountType');

	function onSubmit(_data: FormType) {
		reset();
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!walletsWidget || !pricesWidget) {
		return null;
	}

	return (
		<form
			className="flex w-full flex-col gap-4 p-6"
			onSubmit={handleSubmit(onSubmit)}
		>
			<div>
				<Controller
					render={({ field }) => (
						<FormControl
							error={!!errors.action}
							required
							fullWidth
						>
							<FormLabel
								className="text-base font-medium"
								component="legend"
							>
								Action
							</FormLabel>
							<Select
								{...field}
								variant="outlined"
								fullWidth
							>
								{actionValues.map((item) => (
									<MenuItem
										key={item.value}
										value={item.value}
									>
										{item.title}
									</MenuItem>
								))}
							</Select>
							<FormHelperText>{errors?.action?.message}</FormHelperText>
						</FormControl>
					)}
					name="action"
					control={control}
				/>
			</div>
			<div>
				<Controller
					name="wallet"
					control={control}
					render={({ field }) => (
						<FormControl
							error={!!errors.wallet}
							required
							fullWidth
						>
							<FormLabel
								className="text-base font-medium"
								component="legend"
							>
								Wallet
							</FormLabel>
							<Select
								{...field}
								variant="outlined"
								fullWidth
								onChange={(ev) => {
									field.onChange(ev.target.value);
									setValue('amountType', ev.target.value);
								}}
							>
								{walletValues.map((item) => (
									<MenuItem
										key={item.value}
										value={item.value}
									>
										{`${item.title} - ${
											walletsWidget[item.value as keyof WalletsType]
										} ${item.value.toUpperCase()}`}
									</MenuItem>
								))}
							</Select>
							<FormHelperText className="flex items-center gap-1">
								<Typography
									component="span"
									className="text-md"
								>
									USD:
								</Typography>
								<Typography
									component="span"
									className="text-md font-mono font-medium"
								>
									{(
										walletsWidget[field.value as CoinTypes] * pricesWidget[field.value as CoinTypes]
									).toLocaleString('en-US', {
										style: 'currency',
										currency: 'USD'
									})}
								</Typography>
							</FormHelperText>
							<FormHelperText>{errors?.wallet?.message}</FormHelperText>
						</FormControl>
					)}
				/>
			</div>
			<div>
				<Controller
					name="amount"
					control={control}
					render={({ field: { onChange, value, ...fieldProps } }) => (
						<FormControl
							error={!!errors.amount}
							required
							fullWidth
						>
							<FormLabel
								className="text-base font-medium"
								component="legend"
							>
								Amount
							</FormLabel>
							<TextField
								{...fieldProps}
								value={value || 1}
								onChange={(e) => {
									const number = parseFloat(e.target.value);
									onChange(Number.isNaN(number) ? 1 : number);
								}}
								type="number"
								variant="outlined"
								error={!!errors.amount}
								helperText={
									errors?.amount?.message || (
										<>
											{actionValue === 'buy' && amountTypeValue === 'usd' && (
												<>
													<Typography
														component="span"
														className="text-md"
													>
														You will receive:
													</Typography>
													<Typography
														component="span"
														className="text-md mx-1 font-mono font-medium"
													>
														{(
															value / pricesWidget[walletValue as CoinTypes]
														).toLocaleString('en-US', {
															style: 'currency',
															currency: walletValue,
															maximumFractionDigits: 8
														})}
													</Typography>
												</>
											)}

											{actionValue === 'buy' && amountTypeValue !== 'usd' && (
												<>
													<Typography
														component="span"
														className="text-md"
													>
														it will cost:
													</Typography>
													<Typography
														component="span"
														className="text-md mx-1 font-mono font-medium"
													>
														{(
															value * pricesWidget[walletValue as CoinTypes]
														).toLocaleString('en-US', {
															style: 'currency',
															currency: 'USD'
														})}
													</Typography>
												</>
											)}

											{actionValue === 'sell' && amountTypeValue === 'usd' && (
												<>
													<Typography
														component="span"
														className="text-md"
													>
														You will sell:
													</Typography>
													<Typography
														component="span"
														className="text-md mx-1 font-mono font-medium"
													>
														{(
															value / pricesWidget[walletValue as CoinTypes]
														).toLocaleString('en-US', {
															style: 'currency',
															currency: walletValue,
															maximumFractionDigits: 8
														})}
													</Typography>
												</>
											)}

											{actionValue === 'sell' && amountTypeValue !== 'usd' && (
												<>
													<Typography
														component="span"
														className="text-md"
													>
														You will receive:
													</Typography>
													<Typography
														component="span"
														className="text-md mx-1 font-mono font-medium"
													>
														{(
															value * pricesWidget[walletValue as CoinTypes]
														).toLocaleString('en-US', {
															style: 'currency',
															currency: 'USD'
														})}
													</Typography>
												</>
											)}
										</>
									)
								}
								required
								fullWidth
								slotProps={{
									input: {
										endAdornment: (
											<Controller
												control={control}
												name="amountType"
												render={({ field: _field }) => (
													<FormControl className="min-w-20">
														<Select
															{..._field}
															variant="outlined"
															size="small"
															sx={{
																'& .MuiSelect-select ': {
																	minHeight: '0!important',
																	paddingY: 0
																},
																'& fieldset': {
																	display: 'none'
																}
															}}
														>
															<MenuItem
																key="usd"
																value="usd"
															>
																USD
															</MenuItem>
															<MenuItem
																key={walletValue}
																value={walletValue}
															>
																{walletValue?.toUpperCase()}
															</MenuItem>
														</Select>
													</FormControl>
												)}
											/>
										)
									}
								}}
							/>
						</FormControl>
					)}
				/>
			</div>
			<div className="mt-2 flex items-center">
				<Button
					variant="contained"
					color="secondary"
					type="submit"
					disabled={!isValid}
					fullWidth
				>
					{_.find(actionValues, { value: actionValue })?.title}
				</Button>
			</div>
		</form>
	);
}

export default BuySellForm;
