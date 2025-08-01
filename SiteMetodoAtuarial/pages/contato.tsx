import { Container, Typography, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function PaginaContato() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  type FormData = {
    nome: string;
    email: string;
    mensagem: string;
  };
  const onSubmit = async (data: FormData) => {
    // Simulação de envio de email
    await axios.post('/api/send-email', data);
    reset();
    alert('Mensagem enviada com sucesso!');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>Contato</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Nome" fullWidth margin="normal" {...register('nome', { required: true })} />
        <TextField label="Email" type="email" fullWidth margin="normal" {...register('email', { required: true })} />
        <TextField label="Mensagem" multiline rows={4} fullWidth margin="normal" {...register('mensagem', { required: true })} />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Enviar</Button>
      </form>
    </Container>
  );
}
