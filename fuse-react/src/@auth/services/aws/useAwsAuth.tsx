import { useContext } from 'react';
import AWSAuthContext from './AWSAuthContext';

export const useAwsAuth = () => {
	const context = useContext(AWSAuthContext);

	if (context === undefined) {
		throw new Error('AWSAuthContext must be used within a AWSAuthProvider');
	}

	return context;
};
export default useAwsAuth;
