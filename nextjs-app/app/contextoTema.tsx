"use client";
// Arquivo: contextoTema.tsx
// Contexto React para controle global do tema (dark, claro, etc.)
// Permite alternância de tema e fácil expansão para novos temas

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { temaEscuro, temaClaro } from './temas';
import { Theme } from '@mui/material/styles';

// Tipos para os temas disponíveis
export type NomeTema = 'escuro' | 'claro';

// Mapeamento dos temas
const temas: Record<NomeTema, Theme> = {
  escuro: temaEscuro,
  claro: temaClaro,
};

// Contexto do tema
interface ContextoTemaProps {
  temaAtual: NomeTema;
  setTemaAtual: (tema: NomeTema) => void;
  temaMui: Theme;
}

export const ContextoTema = createContext<ContextoTemaProps | undefined>(undefined);

// Provedor do contexto
export function ProvedorTema({ children }: { children: ReactNode }) {
  // Estado do tema atual, padrão: dark
  const [temaAtual, setTemaAtualState] = useState<NomeTema>('escuro');

  // Carrega o tema salvo nos cookies ao montar
  useEffect(() => {
    const match = document.cookie.match(/(^|;)\s*temaSelecionado=([^;]*)/);
    const temaSalvo = match ? decodeURIComponent(match[2]) as NomeTema : null;
    if (temaSalvo && (temaSalvo === 'escuro' || temaSalvo === 'claro')) {
      setTemaAtualState(temaSalvo);
    }
  }, []);

  // Função para alterar e salvar o tema nos cookies
  const setTemaAtual = (tema: NomeTema) => {
    setTemaAtualState(tema);
    document.cookie = `temaSelecionado=${encodeURIComponent(tema)}; path=/; max-age=31536000`;
  };

  // Retorna o tema MUI correspondente
  const temaMui = temas[temaAtual];

  return (
    <ContextoTema.Provider value={{ temaAtual, setTemaAtual, temaMui }}>
      {children}
    </ContextoTema.Provider>
  );
}

// Hook para acessar o contexto do tema
export function useTema() {
  const contexto = useContext(ContextoTema);
  if (!contexto) {
    throw new Error('useTema deve ser usado dentro do ProvedorTema');
  }
  return contexto;
}

// Comentário: Para adicionar novos temas, basta incluir no objeto "temas" e no tipo NomeTema.
