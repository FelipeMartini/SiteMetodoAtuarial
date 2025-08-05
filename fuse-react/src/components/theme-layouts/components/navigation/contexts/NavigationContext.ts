import { createContext } from 'react';
import { PartialDeep } from 'type-fest';
import { FuseFlatNavItemType, FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

// Define the context type
export type NavigationContextType = {
	navigationItems: FuseFlatNavItemType[];
	appendNavigationItem: (item: FuseNavItemType, parentId?: string | null) => void;
	prependNavigationItem: (item: FuseNavItemType, parentId?: string | null) => void;
	updateNavigationItem: (id: string, item: PartialDeep<FuseNavItemType>) => void;
	removeNavigationItem: (id: string) => void;
	resetNavigation: () => void;
	getNavigationItemById: (id: string) => FuseFlatNavItemType | undefined;
	setNavigation: (items: FuseNavItemType[]) => void;
};

// Create the context
export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);
