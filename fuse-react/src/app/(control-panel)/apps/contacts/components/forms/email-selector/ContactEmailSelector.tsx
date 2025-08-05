import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import EmailInput from './EmailInput';
import { ContactEmailModel } from '../../../api/models/ContactModel';
import { ContactEmail } from '../../../api/types';

type ContactEmailSelectorProps = {
	value: ContactEmail[] | undefined;
	onChange: (T: ContactEmail[]) => void;
	className?: string;
	ref?: React.Ref<HTMLDivElement>;
};

/**
 * The contact email selector.
 */
function ContactEmailSelector(props: ContactEmailSelectorProps) {
	const { value, onChange, className, ref } = props;

	return (
		<div
			className={clsx('w-full', className)}
			ref={ref}
		>
			{value?.map((item, index) => (
				<EmailInput
					value={item}
					key={index}
					onChange={(val: ContactEmail) => {
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
				onClick={() => value && onChange([...value, ContactEmailModel({})])}
			>
				<FuseSvgIcon>lucide:circle-plus</FuseSvgIcon>

				<span className="text-secondary ml-2 font-medium group-hover:underline">Add an email address</span>
			</Button>
		</div>
	);
}

export default ContactEmailSelector;
