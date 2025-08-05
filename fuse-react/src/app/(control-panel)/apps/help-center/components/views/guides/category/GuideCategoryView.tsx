'use client';

import useParams from '@fuse/hooks/useParams';
import { useMemo } from 'react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import _ from 'lodash';
import GuideListMenu from '../../../ui/guide/GuideListMenu';
import { useGuideCategories } from '../../../../api/hooks/guides/useGuideCategories';
import { useGuidesByCategory } from '../../../../api/hooks/guides/useGuidesByCategory';

/**
 * The guide category.
 */
function GuideCategoryView() {
	const routeParams = useParams<{ categorySlug: string }>();
	const { categorySlug } = routeParams;

	const { data: categories } = useGuideCategories();
	const category = useMemo(() => _.find(categories, { slug: categorySlug }), [categories, categorySlug]);

	const { data: guides } = useGuidesByCategory(category?.id);

	return (
		<div className="container flex flex-col items-center p-6 sm:p-10">
			<div className="flex w-full max-w-6xl flex-col">
				<PageBreadcrumb className="mb-2" />
				<div className="text-3xl leading-[1.25] font-semibold tracking-tight">{category?.title}</div>
				<div className="mt-4">
					<GuideListMenu
						list={guides}
						categorySlug={categorySlug}
					/>
				</div>
			</div>
		</div>
	);
}

export default GuideCategoryView;
