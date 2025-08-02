"use client";
// Página Orçamento - Inspirada no site métodoatuarial.com.br
// Permite ao usuário solicitar orçamento de serviços atuariais

import { Container, Typography, Box, TextField, Button, Paper } from "@mui/material";
import { useForm } from "react-hook-form";

// Tipagem do formulário de orçamento
interface FormOrcamento {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  assunto: string;
  mensagem: string;
}

export default function Orcamento() {
  const { register, handleSubmit, reset } = useForm<FormOrcamento>();
  const onSubmit = (data: FormOrcamento) => {
    // Aqui você pode integrar com API ou serviço de envio de e-mail
    alert("Solicitação enviada com sucesso!");
    reset();
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 6 }}>
        {/* Título escuro para temática dark */}
        <Typography variant="h4" color="primary" gutterBottom sx={{ color: '#fff', textShadow: '0 2px 8px #000' }}>
          Solicitar Orçamento
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          Preencha o formulário abaixo para solicitar um orçamento personalizado. Nossa equipe entrará em contato rapidamente!
        </Typography>
        {/* Formulário de orçamento */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField label="Nome" fullWidth margin="normal" {...register("nome", { required: true })} />
          <TextField label="E-mail" type="email" fullWidth margin="normal" {...register("email", { required: true })} />
          <TextField label="Telefone" fullWidth margin="normal" {...register("telefone", { required: true })} />
          <TextField label="Empresa" fullWidth margin="normal" {...register("empresa", { required: true })} />
          <TextField label="Assunto" fullWidth margin="normal" {...register("assunto", { required: true })} />
          <TextField label="Mensagem" multiline rows={4} fullWidth margin="normal" {...register("mensagem", { required: true })} />
          {/* Botão escuro para temática dark */}
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, width: "100%", backgroundColor: '#000', color: '#fff' }}>
            Enviar Solicitação
          </Button>
        </form>
        {/* Informações de contato */}
        <Box sx={{ mt: 4, textAlign: "center", opacity: 0.8 }}>
          <Typography variant="subtitle2">Av. Paulista, 1000 - Conj. 101, São Paulo - SP</Typography>
          <Typography variant="subtitle2">(11) 3333-4444 | contato@metodoactuarial.com.br</Typography>
          <Typography variant="caption">Horário de atendimento: Seg a Sex 8h-18h | Sáb 8h-12h</Typography>
        </Box>
      </Paper>
    </Container>
  );
}
