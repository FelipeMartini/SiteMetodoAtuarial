import { Typography } from '@mui/material';
import clsx from 'clsx';
import { motion } from 'motion/react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';

type AiImageGenHeaderProps = {
	className?: string;
};

function AiImageGenHeader(props: AiImageGenHeaderProps) {
	const { className } = props;

	return (
		<div className={clsx('relative flex flex-col', className)}>
			<PageBreadcrumb className="mb-2" />
			<div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
				<motion.span
					initial={{ x: -20 }}
					animate={{
						x: 0,
						transition: { delay: 0.2 }
					}}
				>
					<Typography className="text-2xl font-semibold tracking-tight">
						AI Image Generator (DALL-E 3)
					</Typography>
				</motion.span>
			</div>
		</div>
	);
}

export default AiImageGenHeader;
