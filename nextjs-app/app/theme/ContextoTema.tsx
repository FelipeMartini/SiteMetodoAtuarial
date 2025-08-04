'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { TemaCustomizado, temasDisponiveis, obterTemaPorNome, obterProximoTema, NomesTema } from './temas';

interface ContextoTemaProps {
  temaAtual: TemaCustomizado;
  nomeTemaAtual: NomesTema;
  alternarTema: () => void;
  selecionarTema: (nome: NomesTema) => void;
  temasDisponiveis: TemaCustomizado[];
  ehModoEscuro: boolean;
}

const ContextoTema = createContext<ContextoTemaProps | undefined>(undefined);

interface ProvedorTemaProps {
  children: React.ReactNode;
}

export function ProvedorTema({ children }: ProvedorTemaProps) {
  const [nomeTemaAtual, setNomeTemaAtual] = useState<NomesTema>('escuro');

  // Carregar tema salvo do localStorage na inicialização
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const temaSalvo = localStorage.getItem('tema-selecionado') as NomesTema;
      if (temaSalvo && temasDisponiveis.some(t => t.nome === temaSalvo)) {
        setNomeTemaAtual(temaSalvo);
      }
    }
  }, []);

  // Salvar tema no localStorage quando mudado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tema-selecionado', nomeTemaAtual);
    }
  }, [nomeTemaAtual]);

  const temaAtual = obterTemaPorNome(nomeTemaAtual);

  const alternarTema = () => {
    const proximoTema = obterProximoTema(nomeTemaAtual);
    setNomeTemaAtual(proximoTema.nome);
  };

  const selecionarTema = (nome: NomesTema) => {
    setNomeTemaAtual(nome);
  };

  const ehModoEscuro = nomeTemaAtual === 'escuro';

  const valorContexto: ContextoTemaProps = {
    temaAtual,
    nomeTemaAtual,
    alternarTema,
    selecionarTema,
    temasDisponiveis,
    ehModoEscuro,
  };

  return (
    <ContextoTema.Provider value={valorContexto}>
      <ThemeProvider theme={temaAtual}>
        {children}
      </ThemeProvider>
    </ContextoTema.Provider>
  );
}

export function useUtilsTema() {
  const contexto = useContext(ContextoTema);
  if (contexto === undefined) {
    throw new Error('useUtilsTema deve ser usado dentro de um ProvedorTema');
  }
  return contexto;
}

// Alias para compatibilidade
export const useTema = useUtilsTema;
export const useTemaAtual = () => useUtilsTema().temaAtual;
export const useAlternarTema = () => useUtilsTema().alternarTema;
