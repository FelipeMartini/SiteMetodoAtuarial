/**
 * Demo Content
 */
import { Box, darken } from '@mui/material';
import clsx from 'clsx';

type DemoContentProps = {
	children?: React.ReactNode;
	className?: string;
};

function DemoContent(props: DemoContentProps) {
	const { children, className } = props;

	return (
		<Box className={clsx('not-prose flex-auto p-6', className)}>
			<Box className="flex flex-col gap-12">
				{/* Header Section */}
				<div>
					<Box
						className="mb-4 h-8 w-48 rounded"
						sx={{
							backgroundColor: (theme) => darken(theme.palette.background.default, 0.05)
						}}
					/>
					<Box className="flex flex-col gap-2">
						<Box
							className="h-4 w-full rounded"
							sx={{
								backgroundColor: (theme) => darken(theme.palette.background.default, 0.05)
							}}
						/>
						<Box
							className="h-4 w-3/4 rounded"
							sx={{
								backgroundColor: (theme) => darken(theme.palette.background.default, 0.05)
							}}
						/>
					</Box>
				</div>

				{/* Content Blocks */}
				<Box className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{[...Array(12)].map((_, i) => (
						<div key={i}>
							<Box
								className="mb-3 h-4 w-36 rounded"
								sx={{
									backgroundColor: (theme) => darken(theme.palette.background.default, 0.05)
								}}
							/>
							<Box className="flex flex-col gap-2">
								<Box
									className="h-3 w-full rounded"
									sx={{
										backgroundColor: (theme) => darken(theme.palette.background.default, 0.05)
									}}
								/>
								<Box
									className="h-3 w-5/6 rounded"
									sx={{
										backgroundColor: (theme) => darken(theme.palette.background.default, 0.05)
									}}
								/>
								<Box
									className="h-3 w-4/6 rounded"
									sx={{
										backgroundColor: (theme) => darken(theme.palette.background.default, 0.05)
									}}
								/>
							</Box>
						</div>
					))}
				</Box>

				{/* Footer Section */}
				<div>
					<Box className="grid grid-cols-2 gap-4 md:grid-cols-3">
						{[...Array(12)].map((_, i) => (
							<Box
								key={i}
								className="h-20 rounded"
								sx={{
									backgroundColor: (theme) => darken(theme.palette.background.default, 0.1)
								}}
							/>
						))}
					</Box>
				</div>
			</Box>
			{children}
		</Box>
	);
}

export default DemoContent;
