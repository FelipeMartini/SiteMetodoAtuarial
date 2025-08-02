import { Container, Typography, Box } from '@mui/material';

export default function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>Método Atuarial</Typography>
        <Typography variant="h5" gutterBottom>
          Bem-vindo à Método Atuarial!
        </Typography>
        <Typography variant="body1" sx={{ mt: 4 }}>
          Somos uma consultoria especializada em previdência e soluções atuariais, com foco em inovação, transparência e resultados para nossos clientes. Nossa equipe é formada por profissionais experientes e comprometidos com a excelência.
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Entre em contato para saber como podemos ajudar sua empresa a alcançar seus objetivos com segurança e eficiência.
        </Typography>
      </Box>
    </Container>
  );
}
