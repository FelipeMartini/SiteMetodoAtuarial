import { ReactNode } from 'react';

export type Notification = {
	id?: string;
	icon?: string;
	title?: string;
	description?: string;
	time?: string;
	read?: boolean;
	link?: string;
	useRouter?: boolean;
	variant?: 'success' | 'info' | 'error' | 'warning' | 'alert' | 'primary' | 'secondary';
	image?: string;
	children?: ReactNode;
};
