import { EmailOptions } from '@/lib/email-service.server';
import { simpleLogger } from '@/lib/simple-logger';

export async function sendWithSendGrid(options: EmailOptions) {
  if (process.env.NODE_ENV !== 'production' && String(process.env.EMAIL_SEND_ENABLED).toLowerCase() !== 'true') {
    const simulatedId = `sendgrid-simulated-${Date.now()}`;
    simpleLogger.info('SendGrid: envio simulado', { to: options.to, subject: options.subject, messageId: simulatedId });
    return { success: true, messageId: simulatedId };
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error('SENDGRID_API_KEY não configurado');
  // Import dinâmico (ESM) para evitar erro de build se a lib não estiver instalada
  // @ts-expect-error - import dinâmico: evita erro de build se @sendgrid/mail não estiver instalado no ambiente de desenvolvimento
  const sgModule: any = await import('@sendgrid/mail').catch((e) => {
    throw new Error('Erro ao importar @sendgrid/mail: ' + String(e));
  });
  const sgMail: any = sgModule?.default ?? sgModule;
  sgMail.setApiKey(apiKey);

  const msg: any = {
    to: Array.isArray(options.to) ? options.to : options.to,
    from: process.env.SENDGRID_FROM || process.env.SMTP_FROM || process.env.SMTP_USER,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  if (options.attachments) {
    msg.attachments = options.attachments.map((a: any) => ({ filename: a.filename, content: typeof a.content === 'string' ? Buffer.from(a.content).toString('base64') : a.content.toString('base64'), type: a.contentType }));
  }

  const response = await sgMail.send(msg as any);
  return { success: true, messageId: response && response[0] && response[0].headers && response[0].headers['x-message-id'] ? response[0].headers['x-message-id'] : `sendgrid-${Date.now()}` };
}
