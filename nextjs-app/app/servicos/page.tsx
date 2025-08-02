// 'use client' deve ser a primeira linha para evitar warnings do ESLint e garantir funcionamento correto do Next.js
"use client";
import React from 'react';
// Página Serviços - Inspirada no site métodoatuarial.com.br
// Lista todos os serviços oferecidos pela consultoria
import { Container, Typography, Box, Card, CardContent, Grid } from "@mui/material";
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import ShieldIcon from '@mui/icons-material/Shield';
import SettingsIcon from '@mui/icons-material/Settings';
import FunctionsIcon from '@mui/icons-material/Functions';
import { useTema } from "../contextoTema";
import { coresCustomizadas } from "../temas";

const servicos = [
  {
    titulo: "Avaliação de Passivos",
    descricao: "Cálculo preciso de passivos atuariais para planos de benefícios definidos, considerando todas as variáveis demográficas e econômicas.",
    // Ícone escuro para temática dark
    icone: <AssessmentIcon fontSize="large" sx={{ color: '#fff' }} />,
  },
  {
    titulo: "Relatórios Regulatórios",
    descricao: "Elaboração de relatórios para atendimento às exigências da PREVIC, CVM e demais órgãos reguladores.",
    icone: <DescriptionIcon fontSize="large" sx={{ color: '#fff' }} />,
  },
  {
    titulo: "Consultoria Previdenciária",
    descricao: "Assessoria completa na estruturação e gestão de planos de previdência empresarial e fundos de pensão.",
    icone: <SettingsIcon fontSize="large" sx={{ color: '#fff' }} />,
  },
  {
    titulo: "Modelagem Atuarial",
    descricao: "Desenvolvimento de modelos matemáticos personalizados para análise de riscos e projeções financeiras.",
    icone: <FunctionsIcon fontSize="large" sx={{ color: '#fff' }} />,
  },
  {
    titulo: "Gestão de Riscos",
    descricao: "Identificação, mensuração e mitigação de riscos atuariais em carteiras de seguros e previdência.",
    icone: <ShieldIcon fontSize="large" sx={{ color: '#fff' }} />,
  },
  {
    titulo: "Treinamentos",
    descricao: "Capacitação de equipes em conceitos atuariais, regulamentação e melhores práticas do mercado.",
    icone: <SchoolIcon fontSize="large" sx={{ color: '#fff' }} />,
  },
];

export default function Servicos() {
  // Obtém o tema atual para aplicar cores dinâmicas
  const { temaAtual, temaMui } = useTema();
  const cores = coresCustomizadas[temaAtual];
  // Componente principal da página de serviços
  // Renderiza todos os serviços em um grid responsivo
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" color="primary" gutterBottom sx={{ color: cores.destaque, textShadow: `0 2px 8px ${temaMui.palette.background.paper}` }}>
        Serviços Atuariais
      </Typography>
      <Grid container spacing={4}>
        {servicos.map((servico, idx) => {
          const IconComp = servico.icone.type; // Get the icon component type
          return (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ background: cores.card, color: temaMui.palette.text.primary, borderRadius: 4, boxShadow: 3, minHeight: 260, transition: 'background 0.3s, color 0.3s' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconComp fontSize="large" sx={{ color: cores.destaque }} />
                    <Typography variant="h6" sx={{ ml: 2, color: cores.destaque }}>{servico.titulo}</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: temaMui.palette.text.secondary }}>{servico.descricao}</Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      {/* Comentário: Todas as cores da página Serviços agora mudam conforme o tema selecionado, facilitando manutenção e expansão. */}
    </Container>
  );
}

