Scripts para ajudar a coletar informações de e-mail no servidor Plesk e testar SMTP

1) collect-email-info.sh
- Objetivo: coletar informações remotas (status do postfix/dovecot, logs, versão do Node, etc.) e testes locais (dig MX, conexão STARTTLS).
- Uso (local/computer que tenha acesso SSH ao servidor):
  ./scripts/collect-email-info.sh --ssh-user felipe --ssh-host plesk.metodoatuarial.com.br --mail-host mail.metodoatuarial.com.br
- Resultado: diretório em ./XLOGS/email-collect-YYYYMMDD-HHMMSS com logs coletados. Comprima antes de enviar para análise, se desejar.

Opção `--ssh-pass`:
- Em ambientes onde não há chaves SSH configuradas, você pode passar opcionalmente `--ssh-pass 'SUA_SENHA'`.
- O script tentará usar `sshpass` para fornecer a senha de forma não-interativa. Se `sshpass` não estiver instalado, o script voltará ao modo interativo e pedirá a senha.
- Segurança: passar senha em linha de comando pode deixar o valor no histórico do shell. Prefira chaves SSH; se usar `--ssh-pass`, elimine o comando do histórico (`history -d <n>`) e apague logs sensíveis.

2) test-smtp.sh
- Objetivo: testar envio SMTP usando swaks quando disponível, ou apenas testar conexão TLS STARTTLS via openssl.
- Uso:
  ./scripts/test-smtp.sh --server mail.metodoatuarial.com.br --port 587 --user mail@metodoatuarial.com.br --pass 'SUA_SENHA' --to destino@exemplo.com
- Observações: evite passar senhas em histórico do shell; recomendo exportar temporariamente variáveis de ambiente:
  export SMTP_PASS='SUA_SENHA'; ./scripts/test-smtp.sh --server mail.metodoatuarial.com.br --port 587 --user mail@... --to destino@...

3) Teste via Node (nodemailer)
- Arquivo: site-metodo/test-email/test-send.js
- Uso (no servidor):
  export SMTP_HOST=mail.metodoatuarial.com.br
  export SMTP_PORT=587
  export SMTP_USER=mail@metodoatuarial.com.br
  export SMTP_PASS='SUA_SENHA'
  export SMTP_FROM=mail@metodoatuarial.com.br
  export TEST_EMAIL_TO=destino@exemplo.com
  node site-metodo/test-email/test-send.js

4) Onde colocar as configurações
- No deploy do Plesk, há duas opções principais:
  A) Variáveis de ambiente no painel Node.js do Plesk: preferível, gerenciável e não comita as credenciais.
     - Vá em Domains → metodoatuarial.com.br → Node.js → Environment variables (adicione SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, EMAIL_SEND_ENABLED=true)
  B) Arquivo `.env` na pasta do projeto (local dev): coloque localmente em `site-metodo/.env` e NUNCA comite. Adicione `site-metodo/.env` ao `.gitignore`.

5) Segurança
- Substitua senhas imediatamente se você já as divulgou.
- Prefira gerar chaves API (SendGrid) em vez de usar senhas longas.
- Use SSH keys e desabilite login por senha quando possível.

Se quiser, eu posso:
- Gerar um script que aplica as variáveis de ambiente via CLI do Plesk (se Plesk CLI estiver instalado no servidor), mas você terá que executar no servidor.
- Orientar passo-a-passo via chat enquanto você executa os scripts e cola saídas.

Escolha a opção: eu gero script para Plesk CLI ou você executa os scripts agora e me envia o XLOGS para analisar.
