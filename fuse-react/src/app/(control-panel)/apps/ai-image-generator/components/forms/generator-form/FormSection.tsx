import { Box, Typography } from '@mui/material';

type FormSectionProps = {
	children: React.ReactNode;
	title?: string;
};

function FormSection(props: FormSectionProps) {
	const { children, title } = props;

	return (
		<Box className="flex w-full flex-col gap-2">
			{title && (
				<Typography
					className="text-xs font-semibold"
					color="text.secondary"
				>
					{title}
				</Typography>
			)}
			<div>{children}</div>
		</Box>
	);
}

export default FormSection;
