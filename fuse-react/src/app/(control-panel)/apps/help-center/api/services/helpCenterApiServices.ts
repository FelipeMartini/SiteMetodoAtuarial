import { api } from '@/utils/api';
import { Faq, FaqCategory, Guide, GuideCategory } from '../types';

export const helpCenterApi = {
	getGuides: () => api.get('mock/help-center/guides').json<Guide[]>(),

	getGuidesByCategory: (categoryId: string) =>
		api
			.get(`mock/help-center/guides`, {
				searchParams: { categoryId }
			})
			.json<Guide[]>(),

	getGuideById: (guideId: string) => api.get(`mock/help-center/guides/${guideId}`).json<Guide>(),

	getGuideCategories: () => api.get('mock/help-center/guide-categories').json<GuideCategory[]>(),

	getFaqs: () => api.get('mock/help-center/faqs').json<Faq[]>(),

	getFaqsByCategory: (categoryId: string) =>
		api
			.get('mock/help-center/faqs', {
				searchParams: { categoryId }
			})
			.json<Faq[]>(),

	getMostlyFaqs: () => api.get('mock/help-center/faqs/most').json<Faq[]>(),

	getFaqCategories: () => api.get('mock/help-center/faqs-categories').json<FaqCategory[]>()
};
