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

interface NotificationEmailProps {
  name?: string;
  email?: string;
  notificationType?: 'info' | 'success' | 'warning' | 'error';
  notificationTitle?: string;
  notificationMessage?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  timestamp?: string;
}

export const NotificationEmail = ({
  name = 'Usuário',
  email = 'usuario@exemplo.com',
  notificationType = 'info',
  notificationTitle = 'Nova Notificação',
  notificationMessage = 'Você tem uma nova notificação em sua conta.',
  priority = 'normal',
  actionUrl = 'https://metodoatuarial.com/notifications',
  actionText = 'Ver Notificações',
  timestamp = new Date().toLocaleString('pt-BR'),
}: NotificationEmailProps) => {
  const getNotificationStyle = () => {
    switch (notificationType) {
      case 'success':
        return {
          icon: '✅',
          color: '#28a745',
          backgroundColor: '#d4edda',
          borderColor: '#c3e6cb',
        };
      case 'warning':
        return {
          icon: '⚠️',
          color: '#ffc107',
          backgroundColor: '#fff3cd',
          borderColor: '#ffeaa7',
        };
      case 'error':
        return {
          icon: '❌',
          color: '#dc3545',
          backgroundColor: '#f8d7da',
          borderColor: '#f1aeb5',
        };
      default:
        return {
          icon: 'ℹ️',
          color: '#007bff',
          backgroundColor: '#cce7ff',
          borderColor: '#99d3ff',
        };
    }
  };

  const notificationStyle = getNotificationStyle();

  const getPriorityBadge = () => {
    switch (priority) {
      case 'urgent':
        return { text: 'URGENTE', color: '#dc3545', bg: '#f8d7da' };
      case 'high':
        return { text: 'ALTA', color: '#fd7e14', bg: '#ffe5cc' };
      case 'low':
        return { text: 'BAIXA', color: '#6c757d', bg: '#f8f9fa' };
      default:
        return { text: 'NORMAL', color: '#007bff', bg: '#cce7ff' };
    }
  };

  const priorityBadge = getPriorityBadge();

  return (
    <Html>
      <Head />
      <Preview>{notificationTitle} - Método Atuarial</Preview>
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
            <div style={{...priorityBadgeStyle, backgroundColor: priorityBadge.bg}}>
              <Text style={{...priorityText, color: priorityBadge.color}}>
                PRIORIDADE {priorityBadge.text}
              </Text>
            </div>

            <div style={{...notificationCard, backgroundColor: notificationStyle.backgroundColor, borderColor: notificationStyle.borderColor}}>
              <Row>
                <Column style={iconColumn}>
                  <Text style={iconText}>{notificationStyle.icon}</Text>
                </Column>
                <Column style={contentColumn}>
                  <Heading style={{...cardTitle, color: notificationStyle.color}}>
                    {notificationTitle}
                  </Heading>
                  <Text style={cardText}>
                    {notificationMessage}
                  </Text>
                  <Text style={timestampText}>
                    {timestamp}
                  </Text>
                </Column>
              </Row>
            </div>
            
            <Text style={text}>
              Olá <strong>{name}</strong>,
            </Text>
            
            <Text style={text}>
              Você recebeu uma nova notificação em sua conta do Método Atuarial. 
              Os detalhes estão destacados acima.
            </Text>

            {actionUrl && (
              <Section style={buttonSection}>
                <Button style={button} href={actionUrl}>
                  {actionText}
                </Button>
              </Section>
            )}

            <Section style={tipsSection}>
              <Text style={tipsTitle}>🔔 Configurações de Notificação</Text>
              <Text style={tipsText}>
                Você pode gerenciar suas preferências de notificação por email 
                acessando as configurações da sua conta.
              </Text>
              <Link href="https://metodoatuarial.com/settings/notifications" style={settingsLink}>
                Gerenciar Notificações →
              </Link>
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              Esta notificação foi enviada para {email} em {timestamp}.
            </Text>
            
            <Text style={footerText}>
              © 2024 Método Atuarial. Todos os direitos reservados.
            </Text>
            
            <Text style={footerText}>
              <Link href="https://metodoatuarial.com/unsubscribe" style={link}>
                Cancelar Notificações
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

const priorityBadgeStyle = {
  padding: '8px 12px',
  borderRadius: '4px',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const priorityText = {
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const notificationCard = {
  border: '2px solid',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 24px',
};

const iconColumn = {
  width: '60px',
  verticalAlign: 'top' as const,
};

const contentColumn = {
  verticalAlign: 'top' as const,
};

const iconText = {
  fontSize: '32px',
  margin: '0',
  textAlign: 'center' as const,
};

const cardTitle = {
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px',
  lineHeight: '24px',
};

const cardText = {
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 8px',
  color: '#374151',
};

const timestampText = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '0',
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

const tipsSection = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '6px',
  padding: '20px',
  margin: '24px 0',
};

const tipsTitle = {
  color: '#495057',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const tipsText = {
  color: '#6c757d',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 12px',
};

const settingsLink = {
  color: '#007ee6',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
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

export default NotificationEmail;
