import { useContext } from 'react';
import { MessengerAppContext } from './MessengerAppContext';

export const useMessengerAppContext = () => {
	return useContext(MessengerAppContext);
};
