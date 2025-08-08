#!/usr/bin/env node
/**
 * Script de Refatoração Estrutural Segura para site-metodo
 *
 * - Caminhos protegidos e compatíveis com espaços
 * - Logs coloridos e detalhados
 * - Registro de progresso para retomada
 * - Checagem de permissões e existência
 * - Parada segura em caso de erro
 * - Idempotente e seguro para múltiplas execuções
 *
 * Execute com: node scripts/refatorar-estrutura.js
 */

const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');

const ROOT = path.resolve(__dirname, '..');
const STATUS_FILE = path.join(ROOT, '.migration-status.json');

function logInfo(msg) { console.log(chalk.blue('[INFO]'), msg); }
function logSuccess(msg) { console.log(chalk.green('[OK]'), msg); }
function logWarn(msg) { console.log(chalk.yellow('[WARN]'), msg); }
function logError(msg) { console.log(chalk.red('[ERRO]'), msg); }

async function promptContinue(msg) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(chalk.yellow(msg + ' (Enter para continuar, Ctrl+C para abortar) '), () => {
      rl.close();
      resolve();
    });
  });
}

async function checkWriteAccess(targetPath) {
  try {
    await fs.access(targetPath, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
    logSuccess(`Diretório criado/ok: "${dir}"`);
  } catch (e) {
    logError(`Falha ao criar diretório: "${dir}"`);
    throw e;
  }
}

async function moveFileSafe(src, dest) {
  try {
    await fs.rename(src, dest);
    logSuccess(`Arquivo movido: "${src}" → "${dest}"`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      logWarn(`Arquivo não encontrado (ignorando): "${src}"`);
    } else {
      logError(`Erro ao mover "${src}" para "${dest}": ${e.message}`);
      throw e;
    }
  }
}

async function moveDirSafe(src, dest) {
  try {
    await fs.rename(src, dest);
    logSuccess(`Pasta movida: "${src}" → "${dest}"`);
  } catch (e) {
    if (e.code === 'ENOENT') {
      logWarn(`Pasta não encontrada (ignorando): "${src}"`);
    } else {
      logError(`Erro ao mover pasta "${src}" para "${dest}": ${e.message}`);
      throw e;
    }
  }
}

async function saveStatus(status) {
  await fs.writeFile(STATUS_FILE, JSON.stringify(status, null, 2));
}

async function loadStatus() {
  try {
    const data = await fs.readFile(STATUS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { step: 0 };
  }
}

module.exports = {
  logInfo, logSuccess, logWarn, logError, promptContinue,
  checkWriteAccess, ensureDir, moveFileSafe, moveDirSafe,
  saveStatus, loadStatus, ROOT, STATUS_FILE
};

// O script principal será implementado nos próximos passos.
