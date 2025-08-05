import Typography from '@mui/material/Typography';

function ResetPasswordPageTitle() {
	return (
		<div className="w-full">
			<img
				className="w-12"
				src="/assets/images/logo/logo.svg"
				alt="logo"
			/>

			<Typography className="mt-8 text-4xl leading-[1.25] font-extrabold tracking-tight">
				Reset password?
			</Typography>
			<div className="mt-0.5 flex items-baseline font-medium">
				<Typography>Fill the form to reset your password</Typography>
			</div>
		</div>
	);
}

export default ResetPasswordPageTitle;
