import { StateCreator } from 'zustand'
import { CurrentUser } from '../types'

export interface SessionSlice {
  currentUser?: CurrentUser
  setCurrentUser: (u?: CurrentUser) => void
  clearCurrentUser: () => void
}

function sanitizeUser(u?: CurrentUser): CurrentUser | undefined {
  if (!u) return undefined
  return {
    id: u.id,
    email: u.email,
    attributes: u.attributes,
  }
}

export const createSessionSlice = <T extends SessionSlice>(): StateCreator<T, [], [], SessionSlice> => (set) => ({
  currentUser: undefined,
  setCurrentUser: (u?: CurrentUser) => set({ currentUser: sanitizeUser(u) } as Partial<T>),
  clearCurrentUser: () => set({ currentUser: undefined } as Partial<T>),
})
