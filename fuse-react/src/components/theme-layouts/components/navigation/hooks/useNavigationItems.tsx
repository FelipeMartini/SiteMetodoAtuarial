import { useMemo } from 'react';
import i18n from '@i18n';
import useUser from '@auth/useUser';
import useI18n from '@i18n/useI18n';
import FuseUtils from '@fuse/utils';
import FuseNavigationHelper from '@fuse/utils/FuseNavigationHelper';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import { useNavigationContext } from '../contexts/useNavigationContext';

function useNavigationItems() {
	const { navigationItems: navigationData } = useNavigationContext();

	const { data: user } = useUser();
	const userRole = user?.role;
	const { languageId } = useI18n();

	const data = useMemo(() => {
		const _navigation = FuseNavigationHelper.unflattenNavigation(navigationData);

		function setAdditionalData(data: FuseNavItemType[]): FuseNavItemType[] {
			return data?.map((item) => ({
				hasPermission: Boolean(FuseUtils.hasPermission(item?.auth, userRole)),
				...item,
				...(item?.translate && item?.title ? { title: i18n.t(`navigation:${item?.translate}`) } : {}),
				...(item?.children ? { children: setAdditionalData(item?.children) } : {})
			}));
		}

		const translatedValues = setAdditionalData(_navigation);

		return translatedValues;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigationData, userRole, languageId]);

	const flattenData = useMemo(() => {
		return FuseNavigationHelper.flattenNavigation(data);
	}, [data]);

	return { data, flattenData };
}

export default useNavigationItems;
