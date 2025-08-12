import nodemailer from 'nodemailer'

// Função utilitária para criar o transporter com base nas variáveis de ambiente
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function POST(req: Request) {
  try {
    const { to, subject, text, html } = await req.json()
    const transporter = createTransporter()

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    })

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      status: 200,
    })
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: _error instanceof Error ? _error.message : _error }),
      { status: 500 }
    )
  }
}

// Dica: coloque as variáveis SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM no seu .env.local ou .env
