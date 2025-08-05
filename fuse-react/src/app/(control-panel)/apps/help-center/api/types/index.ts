export type Guide = {
	id: string;
	categoryId: string;
	slug: string;
	title: string;
	subtitle: string;
	content: string;
};

export type GuideCategory = {
	id: string;
	slug: string;
	title: string;
};

export type Faq = {
	id: string;
	categoryId: string;
	question: string;
	answer: string;
};

export type FaqCategory = {
	id: string;
	slug: string;
	title: string;
};
