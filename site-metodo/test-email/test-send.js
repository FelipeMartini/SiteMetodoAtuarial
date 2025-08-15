// script de teste para enviar email via nodemailer (usa variáveis de ambiente)
const nodemailer = require('nodemailer');

async function main(){
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT == '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const res = await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.TEST_EMAIL_TO || 'destino@exemplo.com',
    subject: 'Teste SMTP via script',
    text: 'Mensagem de teste gerada pelo test-send.js',
  });

  console.log('Resultado:', res);
}

main().catch(e => {
  console.error('Erro:', e);
  process.exit(1);
});
