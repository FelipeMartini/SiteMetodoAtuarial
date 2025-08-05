import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';

function ConfirmationRequiredPageTitle() {
	return (
		<div className="w-full">
			<img
				className="w-12"
				src="/assets/images/logo/logo.svg"
				alt="logo"
			/>

			<Typography className="mt-8 text-4xl leading-[1.25] font-extrabold tracking-tight">
				Confirmation required
			</Typography>
			<Typography className="mt-4">
				A confirmation mail with instructions has been sent to your email address. Follow those instructions to
				confirm your email address and activate your account.
			</Typography>

			<Typography
				className="text-md mt-8 font-medium"
				color="text.secondary"
			>
				Return to <Link to="/sign-in">sign in</Link>
			</Typography>
		</div>
	);
}

export default ConfirmationRequiredPageTitle;
