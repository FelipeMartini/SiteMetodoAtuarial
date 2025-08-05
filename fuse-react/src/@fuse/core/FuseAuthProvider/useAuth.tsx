import { useContext } from 'react';
import FuseAuthContext, { FuseAuthContextType } from './FuseAuthContext';

function useAuth(): FuseAuthContextType {
	const context = useContext(FuseAuthContext);

	if (!context) {
		throw new Error('useAuth must be used within a AuthRouteProvider');
	}

	return context;
}

export default useAuth;
