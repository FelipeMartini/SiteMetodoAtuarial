export default function PaginaPrincipal() {
  return (
    <ProvedorCliente>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h2" gutterBottom>Método Atuarial</Typography>
        <Typography variant="h5" gutterBottom>
          Consultoria especializada em previdência e soluções atuariais.
        </Typography>
        <Button component={Link} href="/clientes" variant="contained" sx={{ mr: 2 }}>
          Área do Cliente
        </Button>
        <Button component={Link} href="/contato" variant="outlined" sx={{ mr: 2 }}>
          Contato
        </Button>
        <Button component={Link} href="/login" variant="text">
          Login / Cadastro
        </Button>
      </Container>
    </ProvedorCliente>
  );
}
import { Container, Typography, Button } from '@mui/material';
import Link from 'next/link';
import ProvedorCliente from './client-provider';
