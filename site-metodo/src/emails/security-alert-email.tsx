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

interface SecurityAlertEmailProps {
  name?: string;
  email?: string;
  alertType?: 'login_attempt' | 'password_change' | 'account_access' | 'suspicious_activity';
  location?: string;
  ipAddress?: string;
  deviceInfo?: string;
  timestamp?: string;
  actionUrl?: string;
}

export const SecurityAlertEmail = ({
  name = 'Usuário',
  email = 'usuario@exemplo.com',
  alertType = 'login_attempt',
  location = 'Localização não identificada',
  ipAddress = '192.168.1.1',
  deviceInfo = 'Dispositivo não identificado',
  timestamp = new Date().toLocaleString('pt-BR'),
  actionUrl = 'https://metodoatuarial.com/security',
}: SecurityAlertEmailProps) => {
  const getAlertInfo = () => {
    switch (alertType) {
      case 'login_attempt':
        return {
          title: 'Tentativa de Login Detectada',
          message: 'Detectamos uma tentativa de login em sua conta.',
          priority: 'high',
        };
      case 'password_change':
        return {
          title: 'Senha Alterada',
          message: 'A senha da sua conta foi alterada.',
          priority: 'medium',
        };
      case 'account_access':
        return {
          title: 'Acesso à Conta',
          message: 'Sua conta foi acessada de um novo dispositivo.',
          priority: 'medium',
        };
      case 'suspicious_activity':
        return {
          title: 'Atividade Suspeita Detectada',
          message: 'Detectamos atividade suspeita em sua conta.',
          priority: 'urgent',
        };
      default:
        return {
          title: 'Alerta de Segurança',
          message: 'Detectamos atividade em sua conta.',
          priority: 'medium',
        };
    }
  };

  const alertInfo = getAlertInfo();

  return (
    <Html>
      <Head />
      <Preview>{alertInfo.title} - Método Atuarial</Preview>
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
            <div style={alertBanner(alertInfo.priority)}>
              <Text style={alertText}>🔒 ALERTA DE SEGURANÇA</Text>
            </div>

            <Heading style={h1}>{alertInfo.title}</Heading>
            
            <Text style={text}>
              Olá <strong>{name}</strong>,
            </Text>
            
            <Text style={text}>
              {alertInfo.message} Por favor, revise os detalhes abaixo:
            </Text>

            <Section style={detailsSection}>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Data/Hora:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{timestamp}</Text>
                </Column>
              </Row>

              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Localização:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{location}</Text>
                </Column>
              </Row>

              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Endereço IP:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{ipAddress}</Text>
                </Column>
              </Row>

              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Dispositivo:</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{deviceInfo}</Text>
                </Column>
              </Row>
            </Section>

            <Text style={text}>
              <strong>Se foi você:</strong> Nenhuma ação é necessária. Você pode ignorar este email.
            </Text>

            <Text style={text}>
              <strong>Se não foi você:</strong> Recomendamos que você altere sua senha imediatamente e 
              revise as configurações de segurança da sua conta.
            </Text>

            <Section style={buttonSection}>
              <Button style={button} href={actionUrl}>
                Revisar Segurança da Conta
              </Button>
            </Section>

            <Section style={tipSection}>
              <Text style={tipTitle}>💡 Dicas de Segurança:</Text>
              <Text style={tipText}>
                • Use senhas únicas e complexas<br />
                • Ative a autenticação de dois fatores<br />
                • Monitore regularmente a atividade da sua conta<br />
                • Nunca compartilhe suas credenciais
              </Text>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Este é um email automático de segurança enviado para {email}.
            </Text>
            
            <Text style={footerText}>
              Se você não tem uma conta no Método Atuarial, pode ignorar este email.
            </Text>
            
            <Text style={footerText}>
              © 2024 Método Atuarial. Todos os direitos reservados.
            </Text>
            
            <Text style={footerText}>
              <Link href="https://metodoatuarial.com/security" style={link}>
                Central de Segurança
              </Link>
              {' | '}
              <Link href="https://metodoatuarial.com/contact" style={link}>
                Suporte
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Estilos
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

const alertBanner = (priority: string) => ({
  backgroundColor: priority === 'urgent' ? '#dc3545' : priority === 'high' ? '#fd7e14' : '#ffc107',
  padding: '12px 16px',
  borderRadius: '4px',
  margin: '0 0 24px',
  textAlign: 'center' as const,
});

const alertText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
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

const detailsSection = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '4px',
  padding: '20px',
  margin: '24px 0',
};

const labelColumn = {
  width: '30%',
  paddingRight: '10px',
};

const valueColumn = {
  width: '70%',
};

const labelText = {
  color: '#6c757d',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 8px',
};

const valueText = {
  color: '#212529',
  fontSize: '14px',
  margin: '0 0 8px',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#dc3545',
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

const tipSection = {
  backgroundColor: '#e7f3ff',
  border: '1px solid #b8daff',
  borderRadius: '4px',
  padding: '20px',
  margin: '24px 0',
};

const tipTitle = {
  color: '#004085',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const tipText = {
  color: '#004085',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
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

export default SecurityAlertEmail;
