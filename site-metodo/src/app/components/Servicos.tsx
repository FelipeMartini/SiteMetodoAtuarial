/**
 * Componente de Serviços institucional, estilizado com styled-components
 * Usar apenas dentro do provider StyledComponentsRegistry
 */
import React from 'react';
import styled from 'styled-components';

// Componente funcional moderno, sem dependências herdadas
// Garantindo compatibilidade com React 19 e styled-components >=6.1.18

const Main = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Titulo = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
`;

const GridServicos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const CardServico = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NomeServico = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
`;

const DescricaoServico = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const servicos = [
  {
    nome: 'Avaliação de Passivos Atuariais',
    descricao: 'Relatórios completos para fundos de pensão, RPPS e empresas, seguindo normas nacionais e internacionais.'
  },
  {
    nome: 'Modelagem e Projeções',
    descricao: 'Simulações atuariais, projeções de cenários, análise de riscos e suporte à tomada de decisão.'
  },
  {
    nome: 'Gestão de Riscos',
    descricao: 'Identificação, mensuração e mitigação de riscos atuariais, financeiros e regulatórios.'
  },
  {
    nome: 'Consultoria Regulatória',
    descricao: 'Apoio em processos regulatórios, auditorias, conformidade e adequação às exigências legais.'
  },
  {
    nome: 'Soluções Personalizadas',
    descricao: 'Projetos sob medida para empresas, fundos e entidades, com foco em inovação e resultados.'
  },
];

const Servicos: React.FC = () => {
  return (
    <Main>
      <Titulo>Serviços</Titulo>
      <GridServicos>
        {servicos.map((servico, idx) => (
          <CardServico key={idx}>
            <NomeServico>{servico.nome}</NomeServico>
            <DescricaoServico>{servico.descricao}</DescricaoServico>
          </CardServico>
        ))}
      </GridServicos>
    </Main>
  );
};

export default Servicos;
