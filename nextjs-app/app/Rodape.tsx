/**
 * Componente Rodape modernizado usando styled-components
 * Apresenta informações institucionais, links úteis, redes sociais e créditos.
 */
"use client";
import React from 'react';
import styled from "styled-components";

const RodapeContainer = styled.footer`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 32px 16px;
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const RodapeContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 32px;
`;

const RodapeSection = styled.section`
  h3 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 16px;
    font-size: 1.2rem;
    font-weight: 600;
  }
  
  p, li {
    margin-bottom: 8px;
    line-height: 1.6;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  a {
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 24px;
  margin-top: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const Rodape: React.FC = React.memo(function Rodape() {
  return (
    <RodapeContainer>
      <RodapeContent>
        <RodapeSection>
          <h3>Método Atuarial</h3>
          <p>Consultoria atuarial especializada com mais de 10 anos de experiência no mercado.</p>
          <p>Soluções precisas e personalizadas para sua empresa.</p>
        </RodapeSection>

        <RodapeSection>
          <h3>Serviços</h3>
          <ul>
            <li><a href="/servicos">Consultoria Atuarial</a></li>
            <li><a href="/servicos">Avaliação de Riscos</a></li>
            <li><a href="/servicos">Relatórios Técnicos</a></li>
            <li><a href="/servicos">Auditoria Atuarial</a></li>
          </ul>
        </RodapeSection>

        <RodapeSection>
          <h3>Contato</h3>
          <p>📍 São Paulo, SP</p>
          <p>📞 (11) 9999-9999</p>
          <p>✉️ contato@metodoatuarial.com.br</p>
          <SocialLinks>
            <a href="#" aria-label="LinkedIn">🔗</a>
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="WhatsApp">📱</a>
          </SocialLinks>
        </RodapeSection>
      </RodapeContent>

      <Copyright>
        © 2024 Método Atuarial. Todos os direitos reservados.
      </Copyright>
    </RodapeContainer>
  );
});

export default Rodape;
