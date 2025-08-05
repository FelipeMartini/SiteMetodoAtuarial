import { useContext } from 'react';
import FirebaseAuthContext from './FirebaseAuthContext';

export const useFirebaseAuth = () => {
	const context = useContext(FirebaseAuthContext);

	if (context === undefined) {
		throw new Error('FirebaseAuthContext must be used within a FirebaseAuthProvider');
	}

	return context;
};
export default useFirebaseAuth;
