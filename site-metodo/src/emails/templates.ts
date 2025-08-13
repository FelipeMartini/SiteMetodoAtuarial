interface EmailTemplateProps {
  name?: string;
  email?: string;
  [key: string]: any;
}

// Template de Boas-vindas
export function createWelcomeEmailHtml(props: EmailTemplateProps): string {
  const { name = 'Usuário', email = 'usuario@exemplo.com', loginUrl = 'https://metodoatuarial.com/login' } = props;
  
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bem-vindo ao Método Atuarial</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
            background-color: #f6f9fc;
            line-height: 1.6;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            margin-bottom: 64px;
        }
        .header { 
            padding: 32px 20px; 
            text-align: center; 
            border-bottom: 1px solid #e6ebf1; 
        }
        .logo { 
            max-width: 150px; 
            height: auto; 
        }
        .content { 
            padding: 32px 20px; 
        }
        .title { 
            color: #1d1c1d; 
            font-size: 24px; 
            font-weight: 600; 
            text-align: center; 
            margin: 0 0 20px; 
        }
        .text { 
            color: #525f7f; 
            font-size: 16px; 
            margin: 0 0 16px; 
        }
        .button-section { 
            text-align: center; 
            margin: 32px 0; 
        }
        .button { 
            display: inline-block; 
            background-color: #007ee6; 
            color: #ffffff; 
            text-decoration: none; 
            padding: 12px 24px; 
            border-radius: 4px; 
            font-weight: 600; 
            font-size: 16px; 
        }
        .button:hover { 
            background-color: #0056b3; 
        }
        .footer { 
            border-top: 1px solid #e6ebf1; 
            padding: 32px 20px 20px; 
            text-align: center; 
        }
        .footer-text { 
            color: #8898aa; 
            font-size: 12px; 
            margin: 0 0 8px; 
        }
        .link { 
            color: #007ee6; 
            text-decoration: underline; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://metodoatuarial.com/logo.png" alt="Método Atuarial" class="logo">
        </div>
        
        <div class="content">
            <h1 class="title">Bem-vindo ao Método Atuarial!</h1>
            
            <p class="text">Olá <strong>${name}</strong>,</p>
            
            <p class="text">
                Seja bem-vindo à plataforma Método Atuarial! Sua conta foi criada com sucesso 
                e você já pode começar a utilizar nossos recursos de cálculos atuariais.
            </p>
            
            <p class="text">
                <strong>Email cadastrado:</strong> ${email}
            </p>
            
            <div class="button-section">
                <a href="${loginUrl}" class="button">Acessar Plataforma</a>
            </div>
            
            <p class="text">
                Se você não criou esta conta, pode ignorar este email com segurança.
            </p>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Este email foi enviado para ${email} como parte dos serviços do Método Atuarial.
            </p>
            
            <p class="footer-text">
                © 2024 Método Atuarial. Todos os direitos reservados.
            </p>
            
            <p class="footer-text">
                <a href="https://metodoatuarial.com/privacy" class="link">Política de Privacidade</a> | 
                <a href="https://metodoatuarial.com/terms" class="link">Termos de Uso</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

// Template de Alerta de Segurança
export function createSecurityAlertEmailHtml(props: EmailTemplateProps): string {
  const { 
    name = 'Usuário', 
    email = 'usuario@exemplo.com',
    alertType = 'login_attempt',
    location = 'Localização não identificada',
    ipAddress = '192.168.1.1',
    deviceInfo = 'Dispositivo não identificado',
    timestamp = new Date().toLocaleString('pt-BR'),
    actionUrl = 'https://metodoatuarial.com/security'
  } = props;

  const getAlertInfo = () => {
    switch (alertType) {
      case 'login_attempt':
        return { title: 'Tentativa de Login Detectada', priority: 'high' };
      case 'password_change':
        return { title: 'Senha Alterada', priority: 'medium' };
      case 'suspicious_activity':
        return { title: 'Atividade Suspeita Detectada', priority: 'urgent' };
      default:
        return { title: 'Alerta de Segurança', priority: 'medium' };
    }
  };

  const alertInfo = getAlertInfo();
  const alertColor = alertInfo.priority === 'urgent' ? '#dc3545' : alertInfo.priority === 'high' ? '#fd7e14' : '#ffc107';

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${alertInfo.title} - Método Atuarial</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
            background-color: #f6f9fc;
            line-height: 1.6;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            margin-bottom: 64px;
        }
        .header { 
            padding: 32px 20px; 
            text-align: center; 
            border-bottom: 1px solid #e6ebf1; 
        }
        .logo { 
            max-width: 150px; 
            height: auto; 
        }
        .content { 
            padding: 32px 20px; 
        }
        .alert-banner { 
            background-color: ${alertColor}; 
            color: white; 
            padding: 12px 16px; 
            border-radius: 4px; 
            text-align: center; 
            margin-bottom: 24px; 
        }
        .alert-text { 
            margin: 0; 
            font-weight: 600; 
            font-size: 14px; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
        }
        .title { 
            color: #1d1c1d; 
            font-size: 24px; 
            font-weight: 600; 
            text-align: center; 
            margin: 0 0 20px; 
        }
        .text { 
            color: #525f7f; 
            font-size: 16px; 
            margin: 0 0 16px; 
        }
        .details-table { 
            background-color: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 4px; 
            padding: 20px; 
            margin: 24px 0; 
        }
        .detail-row { 
            margin-bottom: 12px; 
        }
        .detail-label { 
            color: #6c757d; 
            font-weight: 600; 
            font-size: 14px; 
        }
        .detail-value { 
            color: #212529; 
            font-size: 14px; 
        }
        .button-section { 
            text-align: center; 
            margin: 32px 0; 
        }
        .button { 
            display: inline-block; 
            background-color: #dc3545; 
            color: #ffffff; 
            text-decoration: none; 
            padding: 12px 24px; 
            border-radius: 4px; 
            font-weight: 600; 
            font-size: 16px; 
        }
        .tip-section { 
            background-color: #e7f3ff; 
            border: 1px solid #b8daff; 
            border-radius: 4px; 
            padding: 20px; 
            margin: 24px 0; 
        }
        .tip-title { 
            color: #004085; 
            font-weight: 600; 
            margin: 0 0 12px; 
        }
        .tip-text { 
            color: #004085; 
            font-size: 14px; 
            margin: 0; 
        }
        .footer { 
            border-top: 1px solid #e6ebf1; 
            padding: 32px 20px 20px; 
            text-align: center; 
        }
        .footer-text { 
            color: #8898aa; 
            font-size: 12px; 
            margin: 0 0 8px; 
        }
        .link { 
            color: #007ee6; 
            text-decoration: underline; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://metodoatuarial.com/logo.png" alt="Método Atuarial" class="logo">
        </div>
        
        <div class="content">
            <div class="alert-banner">
                <p class="alert-text">🔒 ALERTA DE SEGURANÇA</p>
            </div>
            
            <h1 class="title">${alertInfo.title}</h1>
            
            <p class="text">Olá <strong>${name}</strong>,</p>
            
            <p class="text">
                Detectamos atividade em sua conta. Por favor, revise os detalhes abaixo:
            </p>
            
            <div class="details-table">
                <div class="detail-row">
                    <div class="detail-label">Data/Hora:</div>
                    <div class="detail-value">${timestamp}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Localização:</div>
                    <div class="detail-value">${location}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Endereço IP:</div>
                    <div class="detail-value">${ipAddress}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Dispositivo:</div>
                    <div class="detail-value">${deviceInfo}</div>
                </div>
            </div>
            
            <p class="text">
                <strong>Se foi você:</strong> Nenhuma ação é necessária.
            </p>
            
            <p class="text">
                <strong>Se não foi você:</strong> Altere sua senha imediatamente.
            </p>
            
            <div class="button-section">
                <a href="${actionUrl}" class="button">Revisar Segurança da Conta</a>
            </div>
            
            <div class="tip-section">
                <p class="tip-title">💡 Dicas de Segurança:</p>
                <div class="tip-text">
                    • Use senhas únicas e complexas<br>
                    • Ative a autenticação de dois fatores<br>
                    • Monitore regularmente a atividade da sua conta
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Este é um email automático de segurança enviado para ${email}.
            </p>
            
            <p class="footer-text">
                © 2024 Método Atuarial. Todos os direitos reservados.
            </p>
            
            <p class="footer-text">
                <a href="https://metodoatuarial.com/security" class="link">Central de Segurança</a> | 
                <a href="https://metodoatuarial.com/contact" class="link">Suporte</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

// Template de Notificação
export function createNotificationEmailHtml(props: EmailTemplateProps): string {
  const { 
    name = 'Usuário',
    email = 'usuario@exemplo.com',
    notificationType = 'info',
    notificationTitle = 'Nova Notificação',
    notificationMessage = 'Você tem uma nova notificação.',
    priority = 'normal',
    actionUrl = 'https://metodoatuarial.com/notifications',
    actionText = 'Ver Notificações',
    timestamp = new Date().toLocaleString('pt-BR')
  } = props;

  const getNotificationStyle = () => {
    switch (notificationType) {
      case 'success':
        return { icon: '✅', color: '#28a745', bg: '#d4edda' };
      case 'warning':
        return { icon: '⚠️', color: '#ffc107', bg: '#fff3cd' };
      case 'error':
        return { icon: '❌', color: '#dc3545', bg: '#f8d7da' };
      default:
        return { icon: 'ℹ️', color: '#007bff', bg: '#cce7ff' };
    }
  };

  const notificationStyle = getNotificationStyle();

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${notificationTitle} - Método Atuarial</title>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif;
            background-color: #f6f9fc;
            line-height: 1.6;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff;
            margin-bottom: 64px;
        }
        .header { 
            padding: 32px 20px; 
            text-align: center; 
            border-bottom: 1px solid #e6ebf1; 
        }
        .logo { 
            max-width: 150px; 
            height: auto; 
        }
        .content { 
            padding: 32px 20px; 
        }
        .notification-card { 
            background-color: ${notificationStyle.bg}; 
            border: 2px solid ${notificationStyle.color}; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 0 0 24px; 
            display: flex; 
            align-items: flex-start; 
        }
        .notification-icon { 
            font-size: 32px; 
            margin-right: 15px; 
        }
        .notification-content { 
            flex: 1; 
        }
        .notification-title { 
            color: ${notificationStyle.color}; 
            font-size: 18px; 
            font-weight: 600; 
            margin: 0 0 8px; 
        }
        .notification-text { 
            color: #374151; 
            font-size: 16px; 
            margin: 0 0 8px; 
        }
        .notification-time { 
            color: #6b7280; 
            font-size: 14px; 
            margin: 0; 
        }
        .text { 
            color: #525f7f; 
            font-size: 16px; 
            margin: 0 0 16px; 
        }
        .button-section { 
            text-align: center; 
            margin: 32px 0; 
        }
        .button { 
            display: inline-block; 
            background-color: #007ee6; 
            color: #ffffff; 
            text-decoration: none; 
            padding: 12px 24px; 
            border-radius: 4px; 
            font-weight: 600; 
            font-size: 16px; 
        }
        .tips-section { 
            background-color: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 6px; 
            padding: 20px; 
            margin: 24px 0; 
        }
        .tips-title { 
            color: #495057; 
            font-weight: 600; 
            margin: 0 0 12px; 
        }
        .tips-text { 
            color: #6c757d; 
            font-size: 14px; 
            margin: 0; 
        }
        .footer { 
            border-top: 1px solid #e6ebf1; 
            padding: 32px 20px 20px; 
            text-align: center; 
        }
        .footer-text { 
            color: #8898aa; 
            font-size: 12px; 
            margin: 0 0 8px; 
        }
        .link { 
            color: #007ee6; 
            text-decoration: underline; 
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://metodoatuarial.com/logo.png" alt="Método Atuarial" class="logo">
        </div>
        
        <div class="content">
            <div class="notification-card">
                <div class="notification-icon">${notificationStyle.icon}</div>
                <div class="notification-content">
                    <h2 class="notification-title">${notificationTitle}</h2>
                    <p class="notification-text">${notificationMessage}</p>
                    <p class="notification-time">${timestamp}</p>
                </div>
            </div>
            
            <p class="text">Olá <strong>${name}</strong>,</p>
            
            <p class="text">
                Você recebeu uma nova notificação em sua conta do Método Atuarial.
            </p>
            
            <div class="button-section">
                <a href="${actionUrl}" class="button">${actionText}</a>
            </div>
            
            <div class="tips-section">
                <p class="tips-title">🔔 Configurações de Notificação</p>
                <p class="tips-text">
                    Você pode gerenciar suas preferências de notificação por email 
                    acessando as configurações da sua conta.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p class="footer-text">
                Esta notificação foi enviada para ${email} em ${timestamp}.
            </p>
            
            <p class="footer-text">
                © 2024 Método Atuarial. Todos os direitos reservados.
            </p>
            
            <p class="footer-text">
                <a href="https://metodoatuarial.com/unsubscribe" class="link">Cancelar Notificações</a> | 
                <a href="https://metodoatuarial.com/contact" class="link">Suporte</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

// Função utilitária para obter template por tipo
export function getEmailTemplate(templateType: string, props: EmailTemplateProps): string {
  switch (templateType) {
    case 'welcome':
      return createWelcomeEmailHtml(props);
    case 'security-alert':
      return createSecurityAlertEmailHtml(props);
    case 'notification':
      return createNotificationEmailHtml(props);
    default:
      throw new Error(`Template ${templateType} não encontrado`);
  }
}
