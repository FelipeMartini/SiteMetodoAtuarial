import _ from 'lodash';
import { MouseEvent, useState } from 'react';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/system/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import clsx from 'clsx';
import { useCountries } from '../../../api/hooks/countries/useCountries';

type CountryCodeSelectorProps = {
	value: string;
	onChange: (T: string) => void;
	className?: string;
	ref?: React.Ref<HTMLDivElement>;
};

/**
 * The country code selector.
 */
function CountryCodeSelector(props: CountryCodeSelectorProps) {
	const { value, onChange, className, ref } = props;
	const { data: countries } = useCountries();
	const country = _.find(countries, { iso: value });
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div ref={ref}>
			<Button
				className={clsx('flex items-center', className)}
				id="country-button"
				aria-controls={open ? 'country-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				disableElevation
				onClick={handleClick}
				endIcon={<KeyboardArrowDownIcon />}
				disableRipple
			>
				<Box
					component="span"
					className="h-4 w-6 overflow-hidden"
					sx={{
						background: "url('/assets/images/apps/contacts/flags.png') no-repeat 0 0",
						backgroundSize: '24px 3876px',
						backgroundPosition: country?.flagImagePos
					}}
				/>
				<span className="ml-2 font-medium">{country?.code}</span>
			</Button>
			<Menu
				id="country-menu"
				MenuListProps={{
					'aria-labelledby': 'country-button'
				}}
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
			>
				{countries?.map((item) => (
					<MenuItem
						onClick={() => {
							onChange(item?.iso);
							handleClose();
						}}
						disableRipple
						key={item.iso}
					>
						<Box
							component="span"
							className="h-4 w-6 overflow-hidden"
							sx={{
								background: "url('/assets/images/apps/contacts/flags.png') no-repeat 0 0",
								backgroundSize: '24px 3876px',
								backgroundPosition: item.flagImagePos
							}}
						/>
						<span className="ml-2 font-medium">{item.code}</span>
					</MenuItem>
				))}
			</Menu>
		</div>
	);
}

export default CountryCodeSelector;
