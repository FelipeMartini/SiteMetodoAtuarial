import { Container, Typography, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';

export default function PaginaLogin() {
  const { register, handleSubmit } = useForm<LoginForm>();
  type LoginForm = {
    email: string;
    senha: string;
  };
  const onSubmit = (data: LoginForm) => {
    alert(`Login/Cadastro realizado para: ${data.email}`);
  };

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <Typography variant="h4" gutterBottom>Login / Cadastro</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField label="Email" type="email" fullWidth margin="normal" {...register('email', { required: true })} />
        <TextField label="Senha" type="password" fullWidth margin="normal" {...register('senha', { required: true })} />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Entrar / Cadastrar</Button>
      </form>
    </Container>
  );
}
