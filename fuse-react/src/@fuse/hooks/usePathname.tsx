import { useLocation } from 'react-router';

function usePathname() {
	const { pathname } = useLocation();

	return pathname;
}

export default usePathname;
