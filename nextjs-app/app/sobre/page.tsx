// Página Sobre - Inspirada no site métodoatuarial.com.br
// Apresenta informações institucionais, equipe e ambiente

import { Container, Typography, Box } from "@mui/material";

export default function Sobre() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      {/* Título da página */}
      <Typography variant="h3" color="primary" gutterBottom>
        {/* Título escuro para temática dark */}
        <Typography variant="h3" color="primary" gutterBottom sx={{ color: '#fff', textShadow: '0 2px 8px #000' }}>
          Sobre a Método Atuarial
        </Typography>
        {/* Texto institucional revisado */}
        <Typography variant="body1" sx={{ mb: 4 }}>
          Com mais de uma década de atuação, a Método Atuarial é referência nacional em consultoria atuarial, oferecendo soluções precisas, personalizadas e inovadoras para empresas de todos os portes. Nossa equipe é formada por atuários certificados, que aplicam metodologias avançadas e utilizam tecnologia de ponta para garantir máxima precisão nos cálculos, projeções e relatórios. Atuamos com ética, transparência e compromisso, sempre focados em superar as expectativas dos nossos clientes e contribuir para o sucesso sustentável de cada organização atendida.
        </Typography>
        {/* Destaques */}
        <Box sx={{ display: "flex", gap: 4, mb: 4, flexWrap: "wrap" }}>
          <Box>
            {/* Destaque escuro para temática dark */}
            <Typography variant="h5" color="secondary" sx={{ color: '#bdbdbd' }}>55+</Typography>
            <Typography variant="body2">Empresas atendidas</Typography>
          </Box>
          <Box>
            <Typography variant="h5" color="secondary" sx={{ color: '#bdbdbd' }}>10+</Typography>
            <Typography variant="body2">Anos de experiência</Typography>
          </Box>
          <Box>
            <Typography variant="h5" color="secondary" sx={{ color: '#bdbdbd' }}>100%</Typography>
            <Typography variant="body2">Satisfação do cliente</Typography>
          </Box>
        </Box>
        {/* Imagens do ambiente */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
          <img src="/office-team.jpg" alt="Equipe Método Atuarial" style={{ maxWidth: 320, borderRadius: 16 }} />
          <img src="/office-1.jpg" alt="Recepção" style={{ maxWidth: 220, borderRadius: 16 }} />
          <img src="/office-2.jpg" alt="Sala de Reuniões" style={{ maxWidth: 220, borderRadius: 16 }} />
          <img src="/office-3.jpg" alt="Área de Trabalho" style={{ maxWidth: 220, borderRadius: 16 }} />
        </Box>
    </Container>
  );
}
