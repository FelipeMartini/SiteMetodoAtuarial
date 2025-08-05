'use client';

import Link from '@fuse/core/Link';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import { useMemo } from 'react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import GuideListMenu from '../../../ui/guide/GuideListMenu';
import { useGuides } from '../../../../api/hooks/guides/useGuides';
import { useGuideCategories } from '../../../../api/hooks/guides/useGuideCategories';

/**
 * The guide categories.
 */
function GuideCategories() {
	const { data: guides } = useGuides();
	const { data: categories } = useGuideCategories();

	const groupedGuides = useMemo(() => {
		return _.map(categories, (category) => ({
			...category,
			guides: _.filter(guides, { categoryId: category.id })
		}));
	}, [categories, guides]);

	return (
		<div className="container flex flex-col items-center p-4">
			<div className="flex w-full max-w-6xl flex-col">
				<PageBreadcrumb className="mb-2" />
				<div className="text-3xl leading-[1.25] font-bold tracking-tight">Guides & Resources</div>
				<div className="mt-8 grid grid-flow-row grid-cols-1 gap-4 sm:grid-cols-2">
					{groupedGuides?.map((category) => (
						<div key={category.id}>
							<Typography
								component={Link}
								to={`/apps/help-center/guides/${category.slug}`}
								className="mb-1 text-xl font-semibold"
								role="button"
							>
								{category.title}
							</Typography>

							<GuideListMenu
								list={category.guides}
								categorySlug={category.slug}
								maxItems={4}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default GuideCategories;
