import { StateCreator } from 'zustand'

export interface ModalSlice {
  openModal: (id: string) => void
  closeModal: (id: string) => void
}

export const createModalSlice: StateCreator<any, [], [], ModalSlice> = (_set, _get) => ({
  openModal: (_id: string) => {
    // Placeholder: projetos maiores podem centralizar a fila de modais aqui
    // Mantivemos simples para evitar breaking changes
    // eslint-disable-next-line no-console
    console.log('openModal', _id)
  },
  closeModal: (_id: string) => {
    // eslint-disable-next-line no-console
    console.log('closeModal', _id)
  },
})
