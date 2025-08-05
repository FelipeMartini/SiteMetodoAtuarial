import Typography from '@mui/material/Typography';

function ComingSoonPageTitle() {
	return (
		<div className="w-full">
			<img
				className="w-12"
				src="/assets/images/logo/logo.svg"
				alt="logo"
			/>
			<Typography className="mt-8 text-4xl leading-[1.25] font-extrabold tracking-tight">
				Almost there!
			</Typography>
			<Typography className="mt-0.5">
				Do you want to be notified when we are ready? Register below so we can notify you about the launch!
			</Typography>
		</div>
	);
}

export default ComingSoonPageTitle;
