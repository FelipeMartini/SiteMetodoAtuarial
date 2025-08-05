import { motion } from 'motion/react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import { SyntheticEvent, useState } from 'react';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Faq } from '../../../api/types';
import FuseLoading from '@fuse/core/FuseLoading';

const container = {
	show: {
		transition: {
			staggerChildren: 0.04
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

type FaqListProps = {
	list: Faq[];
	className?: string;
	isLoading?: boolean;
};

/**
 * The faq list component.
 */
function FaqList(props: FaqListProps) {
	const { list, className, isLoading = false } = props;

	const [expanded, setExpanded] = useState<string | boolean>(false);

	const toggleAccordion = (panel: string) => (_: SyntheticEvent, _expanded: boolean) => {
		setExpanded(_expanded ? panel : false);
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		list?.length > 0 && (
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className={clsx('flex flex-col gap-3', className)}
			>
				{list.map((faq) => (
					<motion.div
						variants={item}
						key={faq.id}
					>
						<Accordion
							classes={{
								root: 'FaqPage-panel'
							}}
							expanded={expanded === faq.id}
							onChange={toggleAccordion(faq.id)}
						>
							<AccordionSummary expandIcon={<FuseSvgIcon>lucide:chevron-down</FuseSvgIcon>}>
								<div className="flex items-center py-1">
									<FuseSvgIcon color="action">lucide:circle-help</FuseSvgIcon>
									<Typography className="px-3 font-medium">{faq.question}</Typography>
								</div>
							</AccordionSummary>

							<AccordionDetails>
								<Typography className="-mt-2 px-8 pb-2 text-base">{faq.answer}</Typography>
							</AccordionDetails>
						</Accordion>
					</motion.div>
				))}
			</motion.div>
		)
	);
}

export default FaqList;
