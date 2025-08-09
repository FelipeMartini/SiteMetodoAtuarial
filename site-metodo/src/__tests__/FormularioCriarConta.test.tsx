import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { FormularioCriarConta } from '@/components/auth/FormularioCriarConta'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

describe('FormularioCriarConta', () => {
  test('valida erro de senhas diferentes', async () => {
  const qc = new QueryClient()
  render(<QueryClientProvider client={qc}><FormularioCriarConta /></QueryClientProvider>)
    fireEvent.input(screen.getByLabelText(/Nome completo/i), { target: { value: 'Usuário Teste' } })
    fireEvent.input(screen.getByLabelText(/Email/i), { target: { value: 'teste@example.com' } })
    fireEvent.input(screen.getByLabelText(/^Senha$/i), { target: { value: 'abcdef' } })
    fireEvent.input(screen.getByLabelText(/Confirmar senha/i), { target: { value: 'abcdeg' } })
    fireEvent.click(screen.getByRole('button', { name: /Criar conta/i }))
    await waitFor(() => {
      expect(screen.getByText(/As senhas não coincidem/i)).toBeInTheDocument()
    })
  })
})
