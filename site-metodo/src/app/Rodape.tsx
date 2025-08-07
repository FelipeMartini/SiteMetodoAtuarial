/**
 * Apresenta informações institucionais, links úteis, redes sociais e créditos.
 */
"use client";
import React from 'react';

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
      <footer className="bg-background text-muted-foreground border-t border-border pt-8">
        <div className="container mx-auto flex flex-wrap justify-between items-start gap-8 py-8">
          <section className="flex-1 min-w-[200px] mb-4">
            <h4 className="text-lg font-semibold mb-4">Institucional</h4>
            <a href="/sobre" className="block text-primary hover:underline mb-2">Sobre</a>
            <a href="/servicos" className="block text-primary hover:underline mb-2">Serviços</a>
            <a href="/contato" className="block text-primary hover:underline">Contato</a>
          </section>
          <section className="flex-1 min-w-[200px] mb-4">
            <h4 className="text-lg font-semibold mb-4">Links Úteis</h4>
            <a href="/area-cliente" className="block text-primary hover:underline mb-2">Área do Cliente</a>
            <a href="/criar-conta" className="block text-primary hover:underline mb-2">Criar Conta</a>
            <a href="/login" className="block text-primary hover:underline">Login</a>
          </section>
          <section className="flex-1 min-w-[200px] mb-4">
            <h4 className="text-lg font-semibold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-facebook-f text-xl"></i>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-instagram text-xl"></i>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-linkedin-in text-xl"></i>
                </a>
              </Button>
            </div>
          </section>
        </div>
        <div className="text-center py-4 border-t border-border text-xs text-muted-foreground">
          © {new Date().getFullYear()} Método Atuarial. Todos os direitos reservados.
        </div>
      </footer>
