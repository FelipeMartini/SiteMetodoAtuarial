import { useContext } from 'react';
import AiImageGenAppContext, { AiImageGenAppContextType } from './AiImageGenAppContext';

export function useAiImageGenAppContext(): AiImageGenAppContextType {
	const context = useContext(AiImageGenAppContext);

	if (!context) {
		throw new Error('useAiImageGenAppContext must be used within an AiImageGenAppProvider');
	}

	return context;
}

export default useAiImageGenAppContext;
