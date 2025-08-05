import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import FormHelperText from '@mui/material/FormHelperText';
import PhoneNumberInput from './PhoneNumberInput';
import { ContactPhoneModel } from '../../../api/models/ContactModel';
import { ContactPhoneNumber } from '../../../api/types';

type PhoneNumberSelectorProps = {
	value: ContactPhoneNumber[] | undefined;
	onChange: (T: ContactPhoneNumber[]) => void;
	className?: string;
	error?: boolean;
	helperText?: string;
	ref?: React.Ref<HTMLDivElement>;
};

/**
 * The phone number selector.
 */
function PhoneNumberSelector(props: PhoneNumberSelectorProps) {
	const { value, onChange, className, error, helperText, ref } = props;

	return (
		<div
			className={clsx('w-full', className)}
			ref={ref}
		>
			{error && helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}

			{value.map((item, index) => (
				<PhoneNumberInput
					value={item}
					key={index}
					onChange={(val) => {
						onChange(value.map((_item, _index) => (index === _index ? val : _item)));
					}}
					onRemove={() => {
						onChange(value.filter((_item, _index) => index !== _index));
					}}
					hideRemove={value.length === 1}
				/>
			))}
			<Button
				className="group mt-0.5 -ml-1 inline-flex cursor-pointer items-center rounded-sm px-1 py-0.5"
				onClick={() => onChange([...value, ContactPhoneModel({})])}
			>
				<FuseSvgIcon>lucide:circle-plus</FuseSvgIcon>

				<span className="text-secondary ml-2 font-medium group-hover:underline">Add a phone number</span>
			</Button>
		</div>
	);
}

export default PhoneNumberSelector;
