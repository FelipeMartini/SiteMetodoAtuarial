# 🚀 Sistema de Deploy Automático para Plesk
**Site Método Atuarial - Deploy Production**

## 📋 Visão Geral

Este sistema oferece deploy completamente automatizado para servidores Plesk, incluindo:

- ✅ **Build otimizado de produção**
- ✅ **Upload via SFTP/rsync**
- ✅ **Configuração automática do servidor**
- ✅ **Migração de banco de dados**
- ✅ **Configuração SSL/certificados**
- ✅ **Sistema de backup automático**
- ✅ **Monitoramento e health checks**
- ✅ **Rollback automático**

## 🛠️ Pré-requisitos

### No servidor local:
- Node.js 18.x ou superior
- npm/yarn
- rsync
- ssh/scp
- jq (parser JSON)

### No servidor Plesk:
- Ubuntu/Debian ou CentOS/RHEL
- Acesso SSH como root ou sudo
- Node.js 18.x
- nginx
- PM2 (será instalado automaticamente)
- certbot (será instalado automaticamente)

## 📁 Estrutura do Sistema

```
plesk/
├── plesk-config.json      # Configuração principal
├── plesk-deploy.sh        # Script principal de deploy
├── build-production.sh    # Build otimizado
├── upload-files.sh        # Upload de arquivos
├── database-migrate.sh    # Migração de banco
├── ssl-setup.sh          # Configuração SSL
├── domain-config.sh      # Configuração de domínio
├── backup-system.sh      # Sistema de backup
├── backups/              # Diretório de backups
└── README-PLESK.md       # Esta documentação
```

## ⚙️ Configuração

### 1. Configurar plesk-config.json

Edite o arquivo `plesk-config.json` com suas configurações:

```json
{
  "project": {
    "domain": "metodoactuarial.com",
    "subdomain": "www"
  },
  "plesk": {
    "server": {
      "host": "seu-servidor.com",
      "username": "root",
      "port": 22
    }
  }
}
```

### 2. Configurar chaves SSH

```bash
# Gerar chave SSH (se não tiver)
ssh-keygen -t rsa -b 4096 -C "deploy@metodoactuarial.com"

# Copiar chave para servidor
ssh-copy-id -p 22 root@seu-servidor.com
```

### 3. Testar conectividade

```bash
# Testar conexão SSH
ssh -p 22 root@seu-servidor.com "echo 'Conexão OK'"
```

## 🚀 Uso do Sistema

### Deploy Completo

```bash
# Deploy padrão (com backup)
./plesk-deploy.sh

# Deploy forçado sem confirmação
./plesk-deploy.sh --force

# Deploy sem backup (mais rápido)
./plesk-deploy.sh --no-backup
```

### Simular Deploy (Dry Run)

```bash
# Simular todo o processo
./plesk-deploy.sh --dry-run
```

### Scripts Individuais

```bash
# Build de produção
./build-production.sh

# Upload de arquivos
./upload-files.sh

# Migração de banco
./database-migrate.sh

# Configuração SSL
./ssl-setup.sh

# Configuração de domínio
./domain-config.sh

# Sistema de backup
./backup-system.sh
```

## 🔧 Scripts Detalhados

### 1. plesk-deploy.sh (Principal)

**Funcionalidades:**
- Orquestra todo o processo de deploy
- Criação de backup automático
- Verificação de dependências
- Health check pós-deploy
- Sistema de rollback

**Opções:**
```bash
--config=arquivo    # Arquivo de configuração personalizado
--env=ambiente      # Ambiente (production, staging)
--backup           # Criar backup (padrão: true)
--no-backup        # Não criar backup
--force            # Deploy sem confirmação
--rollback         # Rollback para backup anterior
--dry-run          # Simular deploy
```

### 2. build-production.sh

**O que faz:**
- Limpa cache e dependências antigas
- Instala dependências de produção
- Gera Prisma client
- Executa build otimizado do Next.js
- Valida integridade do build

### 3. upload-files.sh

**O que faz:**
- Prepara pacote otimizado para produção
- Upload via rsync com exclusões inteligentes
- Configuração de permissões
- Verificação de integridade

### 4. database-migrate.sh

**O que faz:**
- Backup automático do banco atual
- Execução de migrações Prisma
- Verificação de integridade
- Rollback em caso de erro

### 5. ssl-setup.sh

**O que faz:**
- Instalação automática do certbot
- Obtenção de certificados Let's Encrypt
- Configuração nginx com SSL
- Renovação automática

### 6. domain-config.sh

**O que faz:**
- Configuração de estrutura de diretórios
- Instalação e configuração PM2
- Scripts de monitoramento
- Configuração de logs

### 7. backup-system.sh

**O que faz:**
- Backup local e remoto
- Backup de aplicação e banco
- Limpeza automática de backups antigos
- Manifesto detalhado de cada backup

## 🔍 Monitoramento

### Health Check Automático

O sistema inclui:
- Health check a cada 5 minutos
- Reinicialização automática em caso de falha
- Logs detalhados de monitoramento
- Alertas de uso de memória

### Logs

```bash
# Logs do deploy
tail -f XLOGS/plesk-deploy-*.log

# Logs da aplicação (no servidor)
ssh root@servidor "pm2 logs metodoactuarial.com"

# Logs do monitoramento (no servidor)
ssh root@servidor "tail -f /var/log/monitor-metodoactuarial.com.log"
```

## 🔄 Sistema de Backup

### Backup Automático

```bash
# Backup completo (local + remoto)
./backup-system.sh

# Apenas backup local
./backup-system.sh --type=local

# Backup com retenção de 7 dias
./backup-system.sh --retention=7
```

### Rollback

```bash
# Rollback para último backup
./plesk-deploy.sh --rollback

# Listar backups disponíveis
ls -la backups/
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. Erro de Conexão SSH
```bash
# Verificar conectividade
ssh -vvv -p 22 root@servidor

# Verificar chaves SSH
ssh-add -l
```

#### 2. Erro de Build
```bash
# Build local para debugging
cd site-metodo
npm run build
```

#### 3. Erro de Permissões
```bash
# Corrigir permissões no servidor
ssh root@servidor "chown -R www-data:www-data /var/www/vhosts/metodoactuarial.com"
```

#### 4. Aplicação não inicia
```bash
# Verificar status PM2
ssh root@servidor "pm2 status"

# Reiniciar aplicação
ssh root@servidor "pm2 restart metodoactuarial.com"
```

### Logs de Debug

```bash
# Ativar modo debug
export DEBUG=1
./plesk-deploy.sh

# Verificar logs do servidor
ssh root@servidor "journalctl -u nginx -f"
```

## 🔐 Segurança

### Recomendações

1. **Usar usuário específico para deploy** (não root)
2. **Configurar firewall** para portas necessárias
3. **Monitorar logs** regularmente
4. **Manter backups** atualizados
5. **Atualizar certificados SSL** automaticamente

### Permissões de Arquivo

```bash
# Aplicação
644 para arquivos
755 para diretórios

# Scripts
755 para executáveis
600 para configurações sensíveis
```

## 🎯 Exemplos de Uso

### Deploy de Emergência

```bash
# Deploy rápido em produção
./plesk-deploy.sh --force --no-backup

# Health check manual
curl -f https://metodoactuarial.com/api/health
```

### Deploy Seguro

```bash
# Deploy com verificações completas
./plesk-deploy.sh --backup
```

### Manutenção

```bash
# Backup antes de manutenção
./backup-system.sh --type=full

# Deploy após manutenção
./plesk-deploy.sh --force
```

## 📊 Performance

### Métricas

- **Build time**: ~2-5 minutos
- **Upload time**: ~1-3 minutos (dependendo da conexão)
- **Deploy total**: ~5-10 minutos
- **Rollback time**: ~2-3 minutos

### Otimizações

- Build cache para dependências
- Upload diferencial via rsync
- Compressão de arquivos
- Health checks paralelos

## 🤝 Suporte

### Contato

- **Email**: admin@metodoactuarial.com
- **Documentação**: Este arquivo
- **Logs**: `XLOGS/plesk-deploy-*.log`

### Checklist de Deploy

- [ ] Configuração atualizada
- [ ] SSH funcionando
- [ ] Build local bem-sucedido
- [ ] Backup criado
- [ ] Health check passou
- [ ] SSL configurado
- [ ] Monitoramento ativo

---

## 🎉 Deploy Concluído!

Após deploy bem-sucedido, seu site estará disponível em:
- **Principal**: https://metodoactuarial.com
- **WWW**: https://www.metodoactuarial.com

**Monitoramento ativo** e **backups automáticos** configurados! 🚀
