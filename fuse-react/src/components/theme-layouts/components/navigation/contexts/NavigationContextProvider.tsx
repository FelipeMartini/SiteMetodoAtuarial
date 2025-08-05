// Create the provider component
import { ReactNode, useCallback, useState } from 'react';
import { FuseFlatNavItemType, FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import FuseNavigationHelper from '@fuse/utils/FuseNavigationHelper';
import navigationConfig from '@/configs/navigationConfig';
import FuseNavItemModel from '@fuse/core/FuseNavigation/models/FuseNavItemModel';
import { PartialDeep } from 'type-fest';
import { NavigationContext } from '@/components/theme-layouts/components/navigation/contexts/NavigationContext';

export function NavigationContextProvider({ children }: { children: ReactNode }) {
	const [navigationItems, setNavigationItems] = useState<FuseFlatNavItemType[]>(
		FuseNavigationHelper.flattenNavigation(navigationConfig)
	);

	const setNavigation = useCallback((items: FuseNavItemType[]) => {
		setNavigationItems(FuseNavigationHelper.flattenNavigation(items));
	}, []);

	const appendNavigationItem = useCallback(
		(item: FuseNavItemType, parentId?: string | null) => {
			const navigation = FuseNavigationHelper.unflattenNavigation(navigationItems);
			setNavigation(FuseNavigationHelper.appendNavItem(navigation, FuseNavItemModel(item), parentId));
		},
		[navigationItems, setNavigation]
	);

	const prependNavigationItem = useCallback(
		(item: FuseNavItemType, parentId?: string | null) => {
			const navigation = FuseNavigationHelper.unflattenNavigation(navigationItems);
			setNavigation(FuseNavigationHelper.prependNavItem(navigation, FuseNavItemModel(item), parentId));
		},
		[navigationItems, setNavigation]
	);

	const updateNavigationItem = useCallback(
		(id: string, item: PartialDeep<FuseNavItemType>) => {
			const navigation = FuseNavigationHelper.unflattenNavigation(navigationItems);
			setNavigation(FuseNavigationHelper.updateNavItem(navigation, id, item));
		},
		[navigationItems, setNavigation]
	);

	const removeNavigationItem = useCallback(
		(id: string) => {
			const navigation = FuseNavigationHelper.unflattenNavigation(navigationItems);
			setNavigation(FuseNavigationHelper.removeNavItem(navigation, id));
		},
		[navigationItems, setNavigation]
	);

	const resetNavigation = useCallback(() => {
		setNavigationItems(FuseNavigationHelper.flattenNavigation(navigationConfig));
	}, []);

	const getNavigationItemById = useCallback(
		(id: string) => navigationItems.find((item) => item.id === id),
		[navigationItems]
	);

	const value = {
		setNavigation,
		navigationItems,
		appendNavigationItem,
		prependNavigationItem,
		updateNavigationItem,
		removeNavigationItem,
		resetNavigation,
		getNavigationItemById
	};

	return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
