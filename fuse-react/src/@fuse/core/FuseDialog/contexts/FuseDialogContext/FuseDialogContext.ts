'use client';

import React from 'react';
import { FuseDialogProps } from '../../FuseDialog';

export interface FuseDialogContextType {
	dialogs: Record<string, FuseDialogProps>;
	openDialog: (T: FuseDialogProps) => void;
	closeDialog: (id: FuseDialogProps['id']) => void;
}

export const FuseDialogDefaultContext: FuseDialogContextType = {
	dialogs: {},
	openDialog: () => null,
	closeDialog: () => null
};

// Fuse Dialog context
export const FuseDialogContext = React.createContext<FuseDialogContextType>(FuseDialogDefaultContext);
