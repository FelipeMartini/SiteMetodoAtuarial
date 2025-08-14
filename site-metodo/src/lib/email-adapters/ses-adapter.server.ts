import nodemailer from 'nodemailer';
import { EmailOptions } from '@/lib/email-service.server';
import { simpleLogger } from '@/lib/simple-logger';

/**
 * Skeleton adapter para AWS SES.
 * - Lê variáveis de ambiente SES_*
 * - Opera em modo simulado quando EMAIL_SEND_ENABLED != 'true' (para dev)
 */
export async function sendWithSES(options: EmailOptions) {
  if (process.env.NODE_ENV !== 'production' && String(process.env.EMAIL_SEND_ENABLED).toLowerCase() !== 'true') {
    const simulatedId = `ses-simulated-${Date.now()}`;
    simpleLogger.info('SES: envio simulado', { to: options.to, subject: options.subject, messageId: simulatedId });
    return { success: true, messageId: simulatedId };
  }

  // Exemplo de criação de transporte SES via nodemailer (pode ser substituído por aws-sdk)
  const transporter = nodemailer.createTransport({
    host: process.env.SES_SMTP_HOST || process.env.SMTP_HOST,
    port: Number(process.env.SES_SMTP_PORT) || Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SES_SMTP_USER || process.env.SMTP_USER,
      pass: process.env.SES_SMTP_PASS || process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SES_FROM || process.env.SMTP_USER,
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    attachments: options.attachments,
  });

  return { success: true, messageId: (info as any).messageId };
}
