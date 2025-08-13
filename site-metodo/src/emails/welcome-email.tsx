"use client"

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  name?: string;
  email?: string;
  loginUrl?: string;
}

export const WelcomeEmail = ({
  name = 'Usuário',
  email = 'usuario@exemplo.com',
  loginUrl = 'https://metodoatuarial.com/login',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo ao Método Atuarial!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img
            src="https://metodoatuarial.com/logo.png"
            width="150"
            height="50"
            alt="Método Atuarial"
            style={logo}
          />
        </Section>

        <Section style={section}>
          <Heading style={h1}>Bem-vindo ao Método Atuarial!</Heading>
          
          <Text style={text}>
            Olá <strong>{name}</strong>,
          </Text>
          
          <Text style={text}>
            Seja bem-vindo à plataforma Método Atuarial! Sua conta foi criada com sucesso 
            e você já pode começar a utilizar nossos recursos de cálculos atuariais.
          </Text>

          <Text style={text}>
            <strong>Email cadastrado:</strong> {email}
          </Text>

          <Section style={buttonSection}>
            <Button style={button} href={loginUrl}>
              Acessar Plataforma
            </Button>
          </Section>

          <Text style={text}>
            Se você não criou esta conta, pode ignorar este email com segurança.
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            Este email foi enviado para {email} como parte dos serviços do Método Atuarial.
          </Text>
          
          <Text style={footerText}>
            © 2024 Método Atuarial. Todos os direitos reservados.
          </Text>
          
          <Text style={footerText}>
            <Link href="https://metodoatuarial.com/privacy" style={link}>
              Política de Privacidade
            </Link>
            {' | '}
            <Link href="https://metodoatuarial.com/terms" style={link}>
              Termos de Uso
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Estilos inline para máxima compatibilidade
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const logoSection = {
  padding: '32px 20px',
  textAlign: 'center' as const,
  borderBottom: '1px solid #e6ebf1',
};

const logo = {
  margin: '0 auto',
};

const section = {
  padding: '32px 20px',
};

const h1 = {
  color: '#1d1c1d',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '32px',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const footer = {
  borderTop: '1px solid #e6ebf1',
  padding: '32px 20px 20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0 0 8px',
};

const link = {
  color: '#007ee6',
  textDecoration: 'underline',
};

export default WelcomeEmail;
