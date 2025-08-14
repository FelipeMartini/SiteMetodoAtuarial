import { emailService } from '@/lib/email-service.server'

export async function POST(req: Request) {
  try {
    const { to, subject, text, html } = await req.json();

    const result = await emailService.sendEmail({
      to,
      subject,
      html: html ?? undefined,
      text: text ?? undefined,
    });

    if (result.success) {
      return new Response(JSON.stringify({ success: true, messageId: result.messageId }), { status: 200 });
    }

    return new Response(JSON.stringify({ success: false, error: result.error }), { status: 500 });
  } catch (_error) {
    return new Response(
      JSON.stringify({ success: false, error: _error instanceof Error ? _error.message : String(_error) }),
      { status: 500 }
    );
  }
}

// Dica: coloque as variáveis SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM no seu .env.local ou .env
