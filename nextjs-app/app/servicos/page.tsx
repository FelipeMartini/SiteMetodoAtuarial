// 'use client' deve ser a primeira linha para evitar warnings do ESLint e garantir funcionamento correto do Next.js
"use client";
import React from 'react';
// Página Serviços - Inspirada no site métodoatuarial.com.br
// Lista todos os serviços oferecidos pela consultoria
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CardInfo } from "../design-system";
import MuiBox from "@mui/material/Box";
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import ShieldIcon from '@mui/icons-material/Shield';
import SettingsIcon from '@mui/icons-material/Settings';
import FunctionsIcon from '@mui/icons-material/Functions';
import { useTema } from "../contextoTema";
import { coresCustomizadas } from "../temas";
import { ErrorBoundary } from '../components/ErrorBoundary';

// Array de serviços oferecidos pela consultoria, cada serviço é um objeto com título, descrição e ícone
const servicos = [
  {
    titulo: "Consultoria Atuarial",
    descricao: "Análise, avaliação e certificação de planos de previdência, saúde e seguros.",
    icone: AssessmentIcon
  },
  {
    titulo: "Pareceres Técnicos",
    descricao: "Elaboração de pareceres, laudos e relatórios atuariais para órgãos reguladores.",
    icone: DescriptionIcon
  },
  {
    titulo: "Gestão de Riscos",
    descricao: "Modelagem, mensuração e monitoramento de riscos atuariais e financeiros.",
    icone: ShieldIcon
  },
  {
    titulo: "Treinamentos",
    descricao: "Capacitação de equipes em conceitos atuariais, regulamentação e melhores práticas do mercado.",
    icone: SchoolIcon
  },
  {
    titulo: "Implantação de Sistemas",
    descricao: "Apoio na escolha, implantação e customização de sistemas atuariais e ERPs.",
    icone: SettingsIcon
  },
  {
    titulo: "Cálculos Atuariais",
    descricao: "Execução de cálculos de provisões, reservas, solvência e simulações.",
    icone: FunctionsIcon
  }
];

// Memoização do componente para evitar renderizações desnecessárias
const Servicos: React.FC = React.memo(function Servicos() {
  // Obtém o tema atual para aplicar cores dinâmicas
  const { temaAtual, temaMui } = useTema();
  const cores = coresCustomizadas[temaAtual];
  // Componente principal da página de serviços
  // Renderiza todos os serviços em um grid responsivo
  return (
    <ErrorBoundary>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" color="primary" gutterBottom sx={{ color: cores.destaque, textShadow: `0 2px 8px ${temaMui.palette.background.paper}` }}>
          Serviços Atuariais
        </Typography>
        {/* Grid responsivo MUI v5+ usando columns e gridColumn */}
        <MuiBox sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {servicos.map((servico, idx) => {
            const IconComp = servico.icone;
            return (
              <MuiBox key={idx} sx={{ flex: '1 1 300px', minWidth: 260, maxWidth: 400 }}>
                {/* CardInfo do design system, padronizado e integrado ao tema */}
                <CardInfo
                  titulo={servico.titulo}
                  descricao={servico.descricao}
                  sx={{ background: cores.card, color: temaMui.palette.text.primary, borderRadius: 4, boxShadow: 3, minHeight: 260, transition: 'background 0.3s, color 0.3s' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {/* Renderiza o ícone do serviço, cor dinâmica conforme tema */}
                    <IconComp fontSize="large" sx={{ color: cores.destaque }} />
                  </Box>
                </CardInfo>
              </MuiBox>
            );
          })}
        </MuiBox>
        {/* Comentário: Todas as cores da página Serviços agora mudam conforme o tema selecionado, facilitando manutenção e expansão. */}
      </Container>
    </ErrorBoundary>
  );
});
export default Servicos;