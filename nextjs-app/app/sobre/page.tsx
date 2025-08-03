// Importações individuais do Material-UI para melhor performance e evitar duplicidade
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// 'use client' deve ser a primeira linha para evitar warnings do ESLint e garantir funcionamento correto do Next.js
"use client";
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
// Página Sobre - Inspirada no site métodoatuarial.com.br
// Apresenta informações institucionais, equipe e ambiente
// Removido import agrupado do MUI para evitar duplicidade
// import { Container, Typography, Box } from "@mui/material";
import Image from "next/image";
import { useTema } from "../contextoTema";
import { coresCustomizadas } from "../temas";

// Memoização do componente para evitar renderizações desnecessárias
const Sobre: React.FC = React.memo(function Sobre() {
  const { temaAtual, temaMui } = useTema();
  const cores = coresCustomizadas[temaAtual];
  return (
    <ErrorBoundary>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <>
          {/* Título principal com cor do destaque do tema */}
          <Typography
            variant="h3"
            color="primary"
            gutterBottom
            sx={{ color: cores.destaque, textShadow: `0 2px 8px ${temaMui.palette.background.paper}` }}>
            Sobre a Método Atuarial
          </Typography>
          {/* Texto institucional com cor do texto principal do tema */}
          <Typography variant="body1" sx={{ mb: 4, color: temaMui.palette.text.primary }}>
            Com mais de uma década de atuação, a Método Atuarial é referência nacional em consultoria atuarial, oferecendo soluções precisas, personalizadas e inovadoras para empresas de todos os portes. Nossa equipe é formada por atuários certificados, que aplicam metodologias avançadas e utilizam tecnologia de ponta para garantir máxima precisão nos cálculos, projeções e relatórios. Atuamos com ética, transparência e compromisso, sempre focados em superar as expectativas dos nossos clientes e contribuir para o sucesso sustentável de cada organização atendida.
          </Typography>
          {/* Destaques com cor do destaque do tema */}
          <Box sx={{ display: "flex", gap: 4, mb: 4, flexWrap: "wrap" }}>
            <Box>
              <Typography variant="h5" sx={{ color: cores.destaque }}>55+</Typography>
              <Typography variant="body2" sx={{ color: temaMui.palette.text.secondary }}>Empresas atendidas</Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: cores.destaque }}>10+</Typography>
              <Typography variant="body2" sx={{ color: temaMui.palette.text.secondary }}>Anos de experiência</Typography>
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: cores.destaque }}>100%</Typography>
              <Typography variant="body2" sx={{ color: temaMui.palette.text.secondary }}>Satisfação do cliente</Typography>
            </Box>
          </Box>
          {/* Imagens do ambiente */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: { xs: "wrap", sm: "nowrap" },
              width: "100%",
              alignItems: "center"
            }}
          >
            {/* Todas as imagens padronizadas para 220x147px. flexWrap: 'wrap' no xs (mobile) empilha, 'nowrap' no sm+ mantém lado a lado. */}
            {/* Imagens otimizadas com loading="lazy" para melhor performance */}
            {/* Imagem otimizada com quality e blur */}
            <Image src="/office-team.png" alt="Equipe Método Atuarial" width={220} height={147} style={{ borderRadius: 16, objectFit: "cover" }} loading="lazy" quality={85} placeholder="blur" role="img" aria-label="Foto da equipe Método Atuarial" />
            {/* Imagem otimizada com quality e blur */}
            <Image src="/office-1.png" alt="Recepção" width={220} height={147} style={{ borderRadius: 16, objectFit: "cover" }} loading="lazy" quality={85} placeholder="blur" role="img" aria-label="Foto da recepção" />
            {/* Imagem otimizada com quality e blur */}
            <Image src="/office-2.png" alt="Sala de Reuniões" width={220} height={147} style={{ borderRadius: 16, objectFit: "cover" }} loading="lazy" quality={85} placeholder="blur" role="img" aria-label="Foto da sala de reuniões" />
            {/* Imagem otimizada com quality e blur */}
            <Image src="/office-3.png" alt="Área de Trabalho" width={220} height={147} style={{ borderRadius: 16, objectFit: "cover" }} loading="lazy" quality={85} placeholder="blur" role="img" aria-label="Foto da área de trabalho" />
          </Box>
        </>
        {/* Comentário: Todas as cores da página Sobre agora mudam conforme o tema selecionado, facilitando manutenção e expansão. */}
      </Container>
    </ErrorBoundary>
  );
});
export default Sobre;
