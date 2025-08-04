# 3. ARQUIVO: ContextoTema.tsx corrigido com proteção anti-flicker
contexto_tema_corrigido = '''// ContextoTema.tsx - Contexto de tema corrigido para evitar hydration errors
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
  isHydrated: boolean; // Nova propriedade para controlar hydration
}

const ContextoTema = createContext<ContextoTemaProps | undefined>(undefined);

interface ProvedorTemaProps {
  children: React.ReactNode;
}

export function ProvedorTema({ children }: ProvedorTemaProps) {
  // Estado para controlar se já houve hydration
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Tema padrão que será usado no servidor e como fallback
  const TEMA_PADRAO: NomesTema = 'escuro';
  
  // Estado do tema - começa sempre com o padrão para evitar hydration mismatch
  const [nomeTemaAtual, setNomeTemaAtual] = useState<NomesTema>(TEMA_PADRAO);

  // Efeito para hydration - roda apenas no cliente
  useEffect(() => {
    setIsHydrated(true);
    
    // Só depois da hydration, carrega o tema do localStorage
    if (typeof window !== 'undefined') {
      try {
        const temaSalvo = localStorage.getItem('tema-selecionado') as NomesTema;
        
        // Valida se o tema salvo existe na lista de temas disponíveis
        if (temaSalvo && temasDisponiveis.some(t => t.nome === temaSalvo)) {
          setNomeTemaAtual(temaSalvo);
        } else {
          // Se não existe, remove do localStorage e usa o padrão
          localStorage.removeItem('tema-selecionado');
          localStorage.setItem('tema-selecionado', TEMA_PADRAO);
        }
      } catch (error) {
        console.warn('Erro ao carregar tema do localStorage:', error);
        // Em caso de erro, usa o tema padrão
        setNomeTemaAtual(TEMA_PADRAO);
      }
    }
  }, []);

  // Efeito para salvar tema no localStorage (apenas após hydration)
  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem('tema-selecionado', nomeTemaAtual);
        
        // Atualiza meta theme-color dinamicamente
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          const tema = obterTemaPorNome(nomeTemaAtual);
          metaThemeColor.setAttribute('content', tema.cores.primario);
        }
      } catch (error) {
        console.warn('Erro ao salvar tema no localStorage:', error);
      }
    }
  }, [nomeTemaAtual, isHydrated]);

  const temaAtual = obterTemaPorNome(nomeTemaAtual);

  const alternarTema = () => {
    const proximoTema = obterProximoTema(nomeTemaAtual);
    setNomeTemaAtual(proximoTema.nome);
  };

  const selecionarTema = (nome: NomesTema) => {
    // Valida se o tema existe antes de selecionar
    if (temasDisponiveis.some(t => t.nome === nome)) {
      setNomeTemaAtual(nome);
    } else {
      console.warn(`Tema "${nome}" não encontrado. Usando tema padrão.`);
      setNomeTemaAtual(TEMA_PADRAO);
    }
  };

  const ehModoEscuro = nomeTemaAtual === 'escuro';

  const valorContexto: ContextoTemaProps = {
    temaAtual,
    nomeTemaAtual,
    alternarTema,
    selecionarTema,
    temasDisponiveis,
    ehModoEscuro,
    isHydrated,
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
    throw new Error(
      'useUtilsTema deve ser usado dentro de um ProvedorTema. ' +
      'Certifique-se de que o componente está envolvido pelo ProvedorTema.'
    );
  }
  return contexto;
}

// Hooks especializados para casos específicos
export const useTema = useUtilsTema;
export const useTemaAtual = () => useUtilsTema().temaAtual;
export const useAlternarTema = () => useUtilsTema().alternarTema;
export const useEhModoEscuro = () => useUtilsTema().ehModoEscuro;
export const useIsHydrated = () => useUtilsTema().isHydrated;

// Hook para usar tema apenas após hydration (evita flicker)
export const useTemaSeguro = () => {
  const { temaAtual, isHydrated } = useUtilsTema();
  
  // Retorna tema padrão até a hydration completar
  if (!isHydrated) {
    return obterTemaPorNome('escuro');
  }
  
  return temaAtual;
};

/**
 * Principais correções implementadas:
 * 
 * 1. **Proteção contra Hydration Mismatch**:
 *    - Estado isHydrated para controlar quando o localStorage foi carregado
 *    - Servidor e cliente começam com o mesmo tema padrão
 *    - localStorage só é acessado após hydration
 * 
 * 2. **Validação de Temas**:
 *    - Verifica se tema salvo existe antes de aplicar
 *    - Remove temas inválidos do localStorage
 *    - Fallback seguro para tema padrão
 * 
 * 3. **Tratamento de Erros**:
 *    - Try/catch para localStorage (pode falhar em alguns browsers)
 *    - Logs de warning para debugging
 *    - Fallbacks seguros em caso de erro
 * 
 * 4. **Otimizações**:
 *    - Hook useTemaSeguro para componentes que precisam evitar flicker
 *    - Atualização dinâmica de meta theme-color
 *    - Mensagens de erro mais descritivas
 */'''

# Salvando arquivo 3
with open('ContextoTema_corrigido.tsx', 'w', encoding='utf-8') as f:
    f.write(contexto_tema_corrigido)

print("✅ Arquivo 3 criado: ContextoTema_corrigido.tsx")