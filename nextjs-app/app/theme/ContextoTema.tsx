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
  isHydrated: boolean;
}

const ContextoTema = createContext<ContextoTemaProps | undefined>(undefined);

interface ProvedorTemaProps {
  children: React.ReactNode;
}


export function ProvedorTema({ children }: ProvedorTemaProps) {
  // Melhor prática: tema inicial igual ao SSR (pode ser ajustado para ler cookie no futuro)
  // O tema padrão deve ser o mesmo do SSR para evitar FOUC
  const temaPadrao: NomesTema = 'escuro';
  const [nomeTemaAtual, setNomeTemaAtual] = useState<NomesTema>(temaPadrao);
  const [isHydrated, setIsHydrated] = useState(false);

  // Carrega tema salvo do localStorage apenas no client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsHydrated(true);
      const temaSalvo = localStorage.getItem('tema-selecionado') as NomesTema;
      if (temaSalvo && temasDisponiveis.some(t => t.nome === temaSalvo)) {
        setNomeTemaAtual(temaSalvo);
      }
    }
  }, []);

  // Salva tema no localStorage quando mudado
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tema-selecionado', nomeTemaAtual);
    }
  }, [nomeTemaAtual]);

  // Obtém o tema atual
  const temaAtual = obterTemaPorNome(nomeTemaAtual);

  // Alterna para o próximo tema disponível
  const alternarTema = () => {
    const proximoTema = obterProximoTema(nomeTemaAtual);
    setNomeTemaAtual(proximoTema.nome);
  };

  // Seleciona um tema específico
  const selecionarTema = (nome: NomesTema) => {
    setNomeTemaAtual(nome);
  };

  // Verifica se está no modo escuro
  const ehModoEscuro = nomeTemaAtual === 'escuro';

  // Valor do contexto para o provider
  const valorContexto: ContextoTemaProps = {
    temaAtual,
    nomeTemaAtual,
    alternarTema,
    selecionarTema,
    temasDisponiveis,
    ehModoEscuro,
    isHydrated,
  };

  // Fallback visual neutro enquanto carrega preferências do usuário
  // Comentário: Evita layout torto, mantendo fundo e altura mínima
  if (!isHydrated) {
    return (
      <div
        style={{
          background: temaAtual.cores.fundo,
          minHeight: '100vh',
          transition: 'none', // Evita animações indesejadas
        }}
      />
    );
  }

  // Provider do tema, garantindo que o ThemeProvider sempre recebe o tema correto
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
