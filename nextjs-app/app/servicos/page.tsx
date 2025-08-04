/**
 * Página de Seconst Titulo = stylconst S  color: ${({ theme }) => theme.cores.textoSecundar  li {
    color: ${({ theme }) => theme.cores.textoSecundario};};btitulo = styled.p`
  text-align: center;
  margin-bottom: 48px;
  color: ${({ theme }) => theme.cores.textoSecundario};
  font-size: 1.2rem;color: ${({ theme }) => theme.cores.textoSecundario};1`
  text-align: center;
  margin-bottom: 16px;  li {
    color: ${({ theme }) => theme.cores.textoSecundario}; color: ${({ theme }) => theme.cores.primario};
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitulo = styled.p`
  text-align: center;
  margin-bottom: 48px;
  color: ${({ theme }) => theme.cores.textoSecundario};todo Atuarial - Modernizada com styled-components
 */
"use client";
import React from 'react';
import styled from "styled-components";
import { ErrorBoundary } from '../components/ErrorBoundary';

const ServicosContainer = styled.main`
  background: ${({ theme }) => theme.cores.fundo};
  color: ${({ theme }) => theme.cores.texto};
  min-height: 100vh;
  padding: 32px 16px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Titulo = styled.h1`
  text-align: center;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.cores.primario};
  font-size: 2.5rem;
  font-weight: 700;
`;

const Subtitulo = styled.p`
  text-align: center;
  margin-bottom: 48px;
  color: ${({ theme }) => theme.cores.textoSecundario};
  font-size: 1.2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ServicosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 32px;
`;

const ServicoCard = styled.div`
  background: ${({ theme }) => theme.cores.superficie};
  border: 1px solid ${({ theme }) => theme.cores.borda};
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.cores.primario};
  }
`;

const ServicoIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.cores.primario};
`;

const ServicoTitulo = styled.h3`
  color: ${({ theme }) => theme.cores.primario};
  margin-bottom: 12px;
  font-size: 1.3rem;
  font-weight: 600;
`;

const ServicoDescricao = styled.p`
  color: ${({ theme }) => theme.cores.texto};
  line-height: 1.6;
  margin-bottom: 16px;
`;

const ServicoDetalhes = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    color: ${({ theme }) => theme.cores.textoSecundario};
    margin-bottom: 4px;
    padding-left: 20px;
    position: relative;
    
    &:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: ${({ theme }) => theme.cores.secundario};
      font-weight: bold;
    }
  }
`;

const servicos = [
  {
    titulo: "Consultoria Atuarial",
    descricao: "Análise aprofundada de riscos e cálculos atuariais personalizados para sua empresa.",
    icone: "📊",
    detalhes: [
      "Cálculos de reservas técnicas",
      "Análise de viabilidade",
      "Projeções atuariais",
      "Consultoria estratégica"
    ]
  },
  {
    titulo: "Avaliação de Riscos",
    descricao: "Identificação e quantificação de riscos para tomada de decisões estratégicas.",
    icone: "🛡️",
    detalhes: [
      "Modelagem de riscos",
      "Stress testing",
      "Análise de cenários",
      "Relatórios executivos"
    ]
  },
  {
    titulo: "Relatórios Técnicos",
    descricao: "Documentação especializada e laudos técnicos para órgãos reguladores.",
    icone: "📋",
    detalhes: [
      "Laudos atuariais",
      "Relatórios regulatórios",
      "Pareceres técnicos",
      "Documentação customizada"
    ]
  },
  {
    titulo: "Auditoria Atuarial",
    descricao: "Revisão e validação de cálculos e metodologias atuariais existentes.",
    icone: "🔍",
    detalhes: [
      "Revisão de metodologias",
      "Validação de cálculos",
      "Auditoria de processos",
      "Recomendações de melhoria"
    ]
  }
];

export default function Servicos() {
  return (
    <ErrorBoundary>
      <ServicosContainer>
        <Container>
          <Titulo>Nossos Serviços</Titulo>
          <Subtitulo>
            Soluções atuariais especializadas para impulsionar o crescimento e a segurança do seu negócio
          </Subtitulo>

          <ServicosGrid>
            {servicos.map((servico, index) => (
              <ServicoCard key={index}>
                <ServicoIcon>{servico.icone}</ServicoIcon>
                <ServicoTitulo>{servico.titulo}</ServicoTitulo>
                <ServicoDescricao>{servico.descricao}</ServicoDescricao>
                <ServicoDetalhes>
                  {servico.detalhes.map((detalhe, idx) => (
                    <li key={idx}>{detalhe}</li>
                  ))}
                </ServicoDetalhes>
              </ServicoCard>
            ))}
          </ServicosGrid>
        </Container>
      </ServicosContainer>
    </ErrorBoundary>
  );
}
