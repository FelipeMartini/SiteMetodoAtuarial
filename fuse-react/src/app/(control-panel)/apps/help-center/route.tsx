import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import HelpCenterHome from './components/views/HelpCenterHomeView';
import HelpCenterFaqs from './components/views/faqs/HelpCenterFaqsView';
import HelpCenterSupport from './components/views/support/HelpCenterSupportView';
import GuideCategory from './components/views/guides/category/GuideCategoryView';
import GuideCategories from './components/views/guides/category/GuideCategoriesView';
import HelpCenterGuide from './components/views/guides/guide/HelpCenterGuideView';
import { Outlet } from 'react-router';

/**
 * The Help Center App Route.
 */
const Route: FuseRouteItemType = {
	path: 'apps/help-center',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <HelpCenterHome />
		},
		{
			path: 'faqs',
			element: <HelpCenterFaqs />
		},
		{
			path: 'guides',
			children: [
				{
					path: '',
					element: <GuideCategories />
				},
				{
					path: ':categorySlug',
					element: <GuideCategory />
				},
				{
					path: ':categorySlug/:guideId',
					element: <HelpCenterGuide />
				}
			]
		},
		{
			path: 'support',
			element: <HelpCenterSupport />
		}
	]
};

export default Route;
