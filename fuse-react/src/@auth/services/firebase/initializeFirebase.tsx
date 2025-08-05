import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import firebaseConfig from './firebaseAuthConfig';

let initialized = false;

export function initializeFirebase() {
	if (!initialized) {
		try {
			if (!firebase.apps.length) {
				firebase.initializeApp(firebaseConfig);
			}

			firebase.auth(); // Ensure Firebase Auth is available
			initialized = true;
		} catch (error) {
			console.error('Error initializing Firebase:', error);
			initialized = false;
		}
	}

	return initialized;
}

export const firebaseInitialized = initialized;
