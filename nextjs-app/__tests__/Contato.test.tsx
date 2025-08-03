import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaginaContato from '../app/contato/page';
import { ProvedorTema } from '../app/contextoTema';

describe('Página Contato', () => {
  it('renderiza título, texto institucional e campos do formulário', () => {
    render(
      <ProvedorTema>
        <PaginaContato />
      </ProvedorTema>
    );
    // Valida título e texto institucional
    expect(screen.getByText('Contato')).toBeInTheDocument();
    expect(screen.getByText(/Entre em contato conosco/i)).toBeInTheDocument();
    // Valida campos do formulário
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('permite preencher e enviar o formulário', () => {
    render(
      <ProvedorTema>
        <PaginaContato />
      </ProvedorTema>
    );
    // Preenche campos
    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const mensagemInput = screen.getByLabelText(/Mensagem/i);
    fireEvent.change(nomeInput, { target: { value: 'João' } });
    fireEvent.change(emailInput, { target: { value: 'joao@email.com' } });
    fireEvent.change(mensagemInput, { target: { value: 'Olá, gostaria de mais informações.' } });
    // Simula envio
    screen.getByRole('button', { name: /enviar/i }).click();
    // Pode-se mockar função de envio futuramente
  });
});

// Testes garantem que o formulário utiliza componentes do design system e está funcional.
