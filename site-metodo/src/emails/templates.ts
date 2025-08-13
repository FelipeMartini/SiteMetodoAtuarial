"use client"

import { render } from '@react-email/render';
import WelcomeEmail from './welcome-email';
import SecurityAlertEmail from './security-alert-email';
import NotificationEmail from './notification-email';
import PasswordResetEmail from './password-reset-email';

export interface EmailTemplateProps {
  name?: string;
  email?: string;
  [key: string]: any;
}

export type EmailTemplateType = 'welcome' | 'security-alert' | 'notification' | 'password-reset';

/**
 * Renderiza um template de email usando React Email
 */
export async function renderEmailTemplate(
  templateType: EmailTemplateType, 
  props: EmailTemplateProps
): Promise<string> {
  try {
    switch (templateType) {
      case 'welcome':
        return await render(WelcomeEmail(props));
        
      case 'security-alert':
        return await render(SecurityAlertEmail(props));
        
      case 'notification':
        return await render(NotificationEmail(props));
        
      case 'password-reset':
        return await render(PasswordResetEmail(props));
        
      default:
        throw new Error(`Template ${templateType} não encontrado`);
    }
  } catch (error) {
    console.error(`Erro ao renderizar template ${templateType}:`, error);
    throw new Error(`Falha ao renderizar template: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Função legado mantida para compatibilidade - DEPRECATED
 * @deprecated Use renderEmailTemplate() para novos desenvolvimentos
 */
export function getEmailTemplate(templateType: string, props: EmailTemplateProps): string {
  console.warn('getEmailTemplate is deprecated. Use renderEmailTemplate() instead.');
  
  // Fallback simples para templates básicos
  switch (templateType) {
    case 'welcome':
      return createWelcomeEmailSimple(props);
    case 'security-alert':
      return createSecurityAlertEmailSimple(props);
    case 'notification':
      return createNotificationEmailSimple(props);
    case 'password-reset':
      return createPasswordResetEmailSimple(props);
    default:
      throw new Error(`Template ${templateType} não encontrado`);
  }
}

// Templates simples para fallback
function createWelcomeEmailSimple(props: EmailTemplateProps): string {
  const { name = 'Usuário', email = 'usuario@exemplo.com', loginUrl = 'https://metodoatuarial.com/login' } = props;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Bem-vindo ao Método Atuarial</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <h1 style="color: #1d1c1d; text-align: center;">Bem-vindo ao Método Atuarial!</h1>
        <p>Olá <strong>${name}</strong>,</p>
        <p>Seja bem-vindo à plataforma Método Atuarial! Sua conta foi criada com sucesso.</p>
        <p><strong>Email cadastrado:</strong> ${email}</p>
        <div style="text-align: center; margin: 32px 0;">
            <a href="${loginUrl}" style="background-color: #007ee6; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block;">Acessar Plataforma</a>
        </div>
        <p style="font-size: 12px; color: #8898aa; text-align: center;">© 2024 Método Atuarial. Todos os direitos reservados.</p>
    </div>
</body>
</html>`;
}

function createSecurityAlertEmailSimple(props: EmailTemplateProps): string {
  const { name = 'Usuário', email = 'usuario@exemplo.com' } = props;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Alerta de Segurança</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <h1 style="color: #dc2626; text-align: center;">🔒 Alerta de Segurança</h1>
        <p>Olá <strong>${name}</strong>,</p>
        <p>Detectamos atividade em sua conta que requer sua atenção.</p>
        <p style="font-size: 12px; color: #8898aa; text-align: center;">© 2024 Método Atuarial. Todos os direitos reservados.</p>
    </div>
</body>
</html>`;
}

function createNotificationEmailSimple(props: EmailTemplateProps): string {
  const { name = 'Usuário', title = 'Notificação', message = 'Nova notificação' } = props;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Notificação</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <h1 style="color: #2563eb; text-align: center;">${title}</h1>
        <p>Olá <strong>${name}</strong>,</p>
        <p>${message}</p>
        <p style="font-size: 12px; color: #8898aa; text-align: center;">© 2024 Método Atuarial. Todos os direitos reservados.</p>
    </div>
</body>
</html>`;
}

function createPasswordResetEmailSimple(props: EmailTemplateProps): string {
  const { name = 'Usuário', resetUrl = '#', expiresIn = '24 horas' } = props;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Redefinição de Senha</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
        <h1 style="color: #059669; text-align: center;">🔑 Redefinição de Senha</h1>
        <p>Olá <strong>${name}</strong>,</p>
        <p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
        <p><strong>Válido por:</strong> ${expiresIn}</p>
        <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; display: inline-block;">Redefinir Senha</a>
        </div>
        <p style="font-size: 12px; color: #8898aa; text-align: center;">© 2024 Método Atuarial. Todos os direitos reservados.</p>
    </div>
</body>
</html>`;
}
