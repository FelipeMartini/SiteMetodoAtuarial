import { Container, Typography } from '@mui/material';

export default function Clientes() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>Área do Cliente</Typography>
      <Typography>Bem-vindo à área exclusiva para clientes da Método Atuarial.</Typography>
      {/* Conteúdo do dashboard do cliente */}
    </Container>
  );
}
