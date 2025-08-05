import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { PartialDeep } from 'type-fest';
import { createContext } from 'react';
export type FuseSettingsProviderState = {
	userSettings?: PartialDeep<FuseSettingsConfigType>;
	data: FuseSettingsConfigType;
	defaults: FuseSettingsConfigType;
	initial: FuseSettingsConfigType;
};

// FuseSettingsContext type
export type FuseSettingsContextType = FuseSettingsProviderState & {
	setSettings: (newSettings: Partial<FuseSettingsConfigType>) => FuseSettingsConfigType;
};

// Context with a default value of undefined
const FuseSettingsContext = createContext<FuseSettingsContextType | undefined>(undefined);

export default FuseSettingsContext;
