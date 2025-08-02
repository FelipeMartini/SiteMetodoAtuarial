// Página Serviços - Inspirada no site métodoatuarial.com.br
// Lista todos os serviços oferecidos pela consultoria

import { Container, Typography, Box, Card, CardContent, Grid } from "@mui/material";
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import SchoolIcon from '@mui/icons-material/School';
import ShieldIcon from '@mui/icons-material/Shield';
import SettingsIcon from '@mui/icons-material/Settings';
import FunctionsIcon from '@mui/icons-material/Functions';

const servicos = [
  {
    titulo: "Avaliação de Passivos",
    descricao: "Cálculo preciso de passivos atuariais para planos de benefícios definidos, considerando todas as variáveis demográficas e econômicas.",
    icone: <AssessmentIcon fontSize="large" color="primary" />,
  },
  {
    titulo: "Relatórios Regulatórios",
    descricao: "Elaboração de relatórios para atendimento às exigências da PREVIC, CVM e demais órgãos reguladores.",
    icone: <DescriptionIcon fontSize="large" color="primary" />,
  },
  {
    titulo: "Consultoria Previdenciária",
    descricao: "Assessoria completa na estruturação e gestão de planos de previdência empresarial e fundos de pensão.",
    icone: <SettingsIcon fontSize="large" color="primary" />,
  },
  {
    titulo: "Modelagem Atuarial",
    descricao: "Desenvolvimento de modelos matemáticos personalizados para análise de riscos e projeções financeiras.",
    icone: <FunctionsIcon fontSize="large" color="primary" />,
  },
  {
    titulo: "Gestão de Riscos",
    descricao: "Identificação, mensuração e mitigação de riscos atuariais em carteiras de seguros e previdência.",
    icone: <ShieldIcon fontSize="large" color="primary" />,
  },
  {
    titulo: "Treinamentos",
    descricao: "Capacitação de equipes em conceitos atuariais, regulamentação e melhores práticas do mercado.",
    icone: <SchoolIcon fontSize="large" color="primary" />,
  },
];

export default function Servicos() {
  // Componente principal da página de serviços
  // Renderiza todos os serviços em um grid responsivo
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Título da página */}
      <Typography variant="h4" align="center" gutterBottom>
        Serviços Atuariais
      </Typography>
      {/* Grid de serviços */}
      <Grid container spacing={4}>
        {servicos.map((servico, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            {/* Card de serviço individual */}
            <Card sx={{ minHeight: 220 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {servico.icone}
                  <Typography variant="h6" ml={2}>
                    {servico.titulo}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {servico.descricao}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

