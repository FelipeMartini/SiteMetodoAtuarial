"use client";
// 'use client' deve ser a primeira linha para evitar warnings do ESLint e garantir funcionamento correto do Next.js
// Importações individuais do Material-UI para melhor performance e evitar duplicidade
import styled from "styled-components";
import React from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
// Página Sobre - Inspirada no site métodoatuarial.com.br
// Apresenta informações institucionais, equipe e ambiente
// Removido import agrupado do MUI para evitar duplicidade
// import { Container, Typography, Box } from "@mui/material";
import Image from "next/image";
import { useTema } from "../theme/ContextoTema";


// Styled-components fora do componente para evitar warnings e seguir boas práticas
const Container = styled.section`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: ${({ theme }) => theme.cores.fundo};
  color: ${({ theme }) => theme.cores.texto};
`;

const Titulo = styled.h1`
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  color: ${({ theme }) => theme.cores.primario};
  text-shadow: 0 2px 8px ${({ theme }) => theme.sombras.md};
`;

const Texto = styled.p`
  font-size: 1.2rem;
  margin-bottom: 32px;
  text-align: center;
  color: ${({ theme }) => theme.cores.texto};
`;

const Destaques = styled.div`
  display: flex;
  gap: 32px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
`;
const BlocoDestaque = styled.div`
  text-align: center;
  min-width: 120px;
`;

const ValorDestaque = styled.div`
  font-size: 2.2rem;
  font-weight: 700;  
  color: ${({ theme }) => theme.cores.primario};
`;

const TextoDestaque = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.cores.textoSecundario};
`;
const Box = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
  margin-top: 32px;
`;

// Memoização do componente para evitar renderizações desnecessárias
const Sobre: React.FC = React.memo(function Sobre() {
  return (
    <ErrorBoundary>
      <Container>
        <Titulo>Sobre a Método Atuarial</Titulo>
        <Texto>
          Com mais de uma década de atuação, a Método Atuarial é referência nacional em consultoria atuarial, oferecendo soluções precisas, personalizadas e inovadoras para empresas de todos os portes. Nossa equipe é formada por atuários certificados, que aplicam metodologias avançadas e utilizam tecnologia de ponta para garantir máxima precisão nos cálculos, projeções e relatórios. Atuamos com ética, transparência e compromisso, sempre focados em superar as expectativas dos nossos clientes e contribuir para o sucesso sustentável de cada organização atendida.
        </Texto>
        <Destaques>
          <BlocoDestaque>
            <ValorDestaque>55+</ValorDestaque>
            <TextoDestaque>Empresas atendidas</TextoDestaque>
          </BlocoDestaque>
          <BlocoDestaque>
            <ValorDestaque>10+</ValorDestaque>
            <TextoDestaque>Anos de experiência</TextoDestaque>
          </BlocoDestaque>
          <BlocoDestaque>
            <ValorDestaque>100%</ValorDestaque>
            <TextoDestaque>Satisfação do cliente</TextoDestaque>
          </BlocoDestaque>
        </Destaques>
        {/* Comentário: Todos os blocos e textos usam styled-components e alternância de tema. */}
        <Box>
          {/* Imagem otimizada com quality e blur */}
          <Image src="/office-team.png" alt="Equipe Método Atuarial" width={220} height={147} style={{ borderRadius: 16, objectFit: "cover" }} loading="lazy" quality={85} role="img" aria-label="Foto da equipe Método Atuarial" />
          {/* Imagem otimizada com quality e blur */}
          <Image src="/office-1.png" alt="Recepção" width={220} height={147} style={{ borderRadius: 16, objectFit: "cover" }} loading="lazy" quality={85} role="img" aria-label="Foto da recepção" />
          {/* Imagem otimizada com quality e blur */}
          <Image src="/office-2.png" alt="Sala de Reuniões" width={220} height={147} style={{ borderRadius: 16, objectFit: "cover" }} loading="lazy" quality={85} role="img" aria-label="Foto da sala de reuniões" />
          {/* Imagem otimizada com quality e blur */}
          <Image src="/office-3.png" alt="Área de Trabalho" width={220} height={147} style={{ borderRadius: 16, objectFit: "cover" }} loading="lazy" quality={85} role="img" aria-label="Foto da área de trabalho" />
        </Box>
        {/* Comentário: Todas as cores da página Sobre agora mudam conforme o tema selecionado, facilitando manutenção e expansão. */}
      </Container>
    </ErrorBoundary>
  );
});
export default Sobre;
