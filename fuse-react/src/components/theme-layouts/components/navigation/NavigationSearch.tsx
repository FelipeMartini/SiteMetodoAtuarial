'use client';
import FuseSearch from '@fuse/core/FuseSearch';
import useNavigationItems from './hooks/useNavigationItems';

type NavigationSearchProps = {
	className?: string;
	variant?: 'basic' | 'full';
};

/**
 * The navigation search.
 */
function NavigationSearch(props: NavigationSearchProps) {
	const { variant, className } = props;
	const { flattenData: navigation } = useNavigationItems();

	return (
		<FuseSearch
			className={className}
			variant={variant}
			navigation={navigation}
		/>
	);
}

export default NavigationSearch;
