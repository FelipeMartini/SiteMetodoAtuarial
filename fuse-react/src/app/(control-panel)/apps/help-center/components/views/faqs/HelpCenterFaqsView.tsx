'use client';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import FaqList from '../../ui/faq/FaqList';
import { useFaqs } from '../../../api/hooks/faqs/useFaqs';
import { useFaqCategories } from '../../../api/hooks/faqs/useFaqCategories';

/**
 * The help center faqs page.
 */
function HelpCenterFaqs() {
	const { data: faqs, isLoading: isFaqsLoading } = useFaqs();
	const { data: categories } = useFaqCategories();

	const groupedFaqs = useMemo(() => {
		return categories?.map((category) => ({
			...category,
			faqs: faqs?.filter((faq) => faq.categoryId === category.id)
		}));
	}, [faqs, categories]);

	return (
		<div className="container flex flex-col items-center p-4">
			<div className="flex w-full max-w-6xl flex-col">
				<PageBreadcrumb className="mb-2" />
				<div className="mb-8 text-3xl leading-[1.25] font-bold tracking-tight">Frequently Asked Questions</div>

				{groupedFaqs?.map((category) => (
					<div
						key={category.id}
						className="mb-10"
					>
						<Typography className="mb-4 text-xl leading-[1.25] font-semibold tracking-tight">
							{category.title}
						</Typography>
						<FaqList
							className="w-full"
							list={category.faqs}
							isLoading={isFaqsLoading}
						/>
					</div>
				))}
			</div>
		</div>
	);
}

export default HelpCenterFaqs;
