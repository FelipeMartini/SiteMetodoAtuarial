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
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetEmailProps {
  name?: string;
  email?: string;
  resetUrl?: string;
  expiresIn?: string;
  deviceInfo?: string;
  ipAddress?: string;
  timestamp?: string;
}

export const PasswordResetEmail = ({
  name = 'Usuário',
  email = 'usuario@exemplo.com',
  resetUrl = 'https://metodoatuarial.com/reset-password',
  expiresIn = '24 horas',
  deviceInfo = 'Dispositivo não identificado',
  ipAddress = '0.0.0.0',
  timestamp = new Date().toLocaleString('pt-BR'),
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>🔑 Redefinir senha - Método Atuarial</Preview>
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
          <Heading style={h1}>🔑 Redefinição de Senha</Heading>
          
          <Text style={text}>
            Olá <strong>{name}</strong>,
          </Text>
          
          <Text style={text}>
            Recebemos uma solicitação para redefinir a senha da sua conta. 
            Se você fez esta solicitação, clique no botão abaixo para criar uma nova senha.
          </Text>

          <Section style={warningBox}>
            <Text style={warningTitle}>⏰ Link Temporário</Text>
            <Text style={warningText}>
              Este link é válido por apenas <strong>{expiresIn}</strong> e pode ser usado apenas uma vez.
            </Text>
          </Section>

          <Section style={buttonSection}>
            <Button style={resetButton} href={resetUrl}>
              Redefinir Minha Senha
            </Button>
          </Section>

          <Section style={securityBox}>
            <Text style={securityTitle}>🔒 Informações de Segurança</Text>
            
            <Row style={detailRow}>
              <Column style={detailLabel}>
                <Text style={labelText}>Solicitado em:</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={valueText}>{timestamp}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={detailLabel}>
                <Text style={labelText}>Dispositivo:</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={valueText}>{deviceInfo}</Text>
              </Column>
            </Row>

            <Row style={detailRow}>
              <Column style={detailLabel}>
                <Text style={labelText}>Endereço IP:</Text>
              </Column>
              <Column style={detailValue}>
                <Text style={valueText}>{ipAddress}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={alertBox}>
            <Text style={alertText}>
              🚨 <strong>Não solicitou esta redefinição?</strong>
              <br />
              Se você não solicitou a redefinição de senha, ignore este email. 
              Sua senha atual permanecerá inalterada. Para maior segurança, 
              recomendamos ativar a autenticação multifator.
            </Text>
          </Section>

          <Text style={infoText}>
            💡 <strong>Dicas de Segurança:</strong>
            <br />
            • Use uma senha forte com pelo menos 12 caracteres
            <br />
            • Combine letras maiúsculas, minúsculas, números e símbolos
            <br />
            • Não reutilize senhas de outras contas
            <br />
            • Considere usar um gerenciador de senhas
          </Text>

          <Text style={text}>
            Se você precisar de ajuda, entre em contato com nosso suporte.
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            Este email foi enviado para {email} como parte dos serviços de segurança.
          </Text>
          
          <Text style={footerText}>
            © 2024 Método Atuarial. Todos os direitos reservados.
          </Text>
          
          <Text style={footerText}>
            <Link href="https://metodoatuarial.com/security" style={link}>
              Central de Segurança
            </Link>
            {' | '}
            <Link href="https://metodoatuarial.com/support" style={link}>
              Suporte
            </Link>
            {' | '}
            <Link href="https://metodoatuarial.com/privacy" style={link}>
              Política de Privacidade
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

const warningBox = {
  backgroundColor: '#fef3cd',
  border: '1px solid #fde68a',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const warningTitle = {
  color: '#92400e',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const warningText = {
  color: '#92400e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const securityBox = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const securityTitle = {
  color: '#334155',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const alertBox = {
  backgroundColor: '#fef2f2',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const alertText = {
  color: '#991b1b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const detailRow = {
  marginBottom: '8px',
};

const detailLabel = {
  width: '35%',
  verticalAlign: 'top',
};

const detailValue = {
  width: '65%',
  verticalAlign: 'top',
};

const labelText = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const valueText = {
  color: '#1e293b',
  fontSize: '14px',
  margin: '0',
};

const infoText = {
  backgroundColor: '#f0f9ff',
  border: '1px solid #bae6fd',
  borderRadius: '6px',
  color: '#0c4a6e',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '24px 0',
  padding: '16px',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const resetButton = {
  backgroundColor: '#059669',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
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

export default PasswordResetEmail;
