import { StateCreator } from 'zustand'

export interface ModalSlice {
  openModal: (id: string) => void
  closeModal: (id: string) => void
}

export const createModalSlice = <T extends ModalSlice>(): StateCreator<T, [], [], ModalSlice> => () => ({
  openModal: (id: string) => {
    // eslint-disable-next-line no-console
    console.log('openModal', id)
  },
  closeModal: (id: string) => {
    // eslint-disable-next-line no-console
    console.log('closeModal', id)
  },
})
