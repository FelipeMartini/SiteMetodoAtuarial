import { StateCreator } from 'zustand'
import { CurrentUser } from '../types'

export interface SessionSlice {
  currentUser?: CurrentUser
  setCurrentUser: (u?: CurrentUser) => void
  clearCurrentUser: () => void
}

export const createSessionSlice: StateCreator<any, [], [], SessionSlice> = (_set, _get) => ({
  currentUser: undefined,
  setCurrentUser: (u?: CurrentUser) => _set({ currentUser: u }),
  clearCurrentUser: () => _set({ currentUser: undefined }),
})
