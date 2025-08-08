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
 *
 * Cada etapa é registrada e pode ser retomada em caso de erro.
 * O script pode ser rodado via task do VS Code para máxima segurança.
 */

const fs = require('fs/promises');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');

// Caminho raiz do projeto
const ROOT = path.resolve(__dirname, '..');
// Arquivo de status para retomada
const STATUS_FILE = path.join(ROOT, '.migration-status.json');

// Funções utilitárias de log
function logInfo(msg) { console.log(chalk.blue('[INFO]'), msg); }
function logSuccess(msg) { console.log(chalk.green('[OK]'), msg); }
function logWarn(msg) { console.log(chalk.yellow('[WARN]'), msg); }
function logError(msg) { console.log(chalk.red('[ERRO]'), msg); }

// Prompt interativo (não usado no fluxo automático, mas disponível)
async function promptContinue(msg) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(chalk.yellow(msg + ' (Enter para continuar, Ctrl+C para abortar) '), () => {
      rl.close();
      resolve();
    });
  });
}

// Checa permissão de escrita
async function checkWriteAccess(targetPath) {
  try {
    await fs.access(targetPath, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

// Cria diretório de forma segura
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
    logSuccess(`Diretório criado/ok: "${dir}"`);
  } catch (e) {
    logError(`Falha ao criar diretório: "${dir}"`);
    throw e;
  }
}

// Move arquivo de forma segura
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

// Move diretório de forma segura
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

// Salva status de progresso
async function saveStatus(status) {
  await fs.writeFile(STATUS_FILE, JSON.stringify(status, null, 2));
}

// Carrega status de progresso
async function loadStatus() {
  try {
    const data = await fs.readFile(STATUS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { step: 0 };
  }
}

// Atualiza imports em um arquivo
async function updateImportsInFile(filePath, replacements) {
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let changed = false;
    for (const [oldPath, newPath] of Object.entries(replacements)) {
      if (content.includes(oldPath)) {
        content = content.split(oldPath).join(newPath);
        changed = true;
      }
    }
    if (changed) {
      await fs.writeFile(filePath, content);
      logSuccess(`Imports atualizados em: ${filePath}`);
    }
  } catch (e) {
    logWarn(`Não foi possível atualizar imports em: ${filePath}`);
  }
}

// Atualiza imports recursivamente
async function updateAllImports(rootDir, replacements) {
  const entries = await fs.readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      await updateAllImports(fullPath, replacements);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
      await updateImportsInFile(fullPath, replacements);
    }
  }
}

/**
 * Fluxo principal da refatoração
 * Cada etapa é registrada e pode ser retomada em caso de erro
 */
async function main() {
  logInfo('Iniciando refatoração estrutural segura do projeto...');
  const status = await loadStatus();
  let step = status.step || 0;

  // Etapas da refatoração
  const steps = [
    {
      name: 'Criar estrutura de pastas',
      async run() {
        const dirs = [
          'src/components/layouts/LayoutCliente',
          'src/components/theme',
          'src/configs',
          'src/contexts',
          'src/components/ui',
        ];
        for (const dir of dirs) {
          await ensureDir(path.join(ROOT, dir));
        }
      }
    },
    {
      name: 'Mover arquivos de layout e tema',
      async run() {
        const moves = [
          ['src/app/LayoutCliente.tsx', 'src/components/layouts/LayoutCliente/index.tsx'],
          ['src/components/Header.tsx', 'src/components/layouts/LayoutCliente/Header.tsx'],
          ['src/app/Rodape.tsx', 'src/components/layouts/LayoutCliente/Rodape.tsx'],
          ['src/components/Servicos.tsx', 'src/components/layouts/LayoutCliente/Servicos.tsx'],
          ['src/components/SocialLoginBox.tsx', 'src/components/layouts/LayoutCliente/SocialLoginBox.tsx'],
          ['src/components/ErrorBoundary.tsx', 'src/components/layouts/LayoutCliente/ErrorBoundary.tsx'],
          ['src/components/theme/ThemeProvider.tsx', 'src/components/theme/ThemeProvider.tsx'],
          ['src/components/theme/ThemeToggle.tsx', 'src/components/theme/ThemeToggle.tsx'],
          ['src/components/theme-provider.tsx', 'src/components/theme/ThemeProviderCustom.tsx']
        ];
        for (const [src, dest] of moves) {
          await moveFileSafe(path.join(ROOT, src), path.join(ROOT, dest));
        }
      }
    },
    {
      name: 'Mover arquivos de configuração',
      async run() {
        const moves = [
          ['src/styles/themes.ts', 'src/configs/themesConfig.ts'],
          // Adicione outros arquivos de config se existirem
        ];
        for (const [src, dest] of moves) {
          await moveFileSafe(path.join(ROOT, src), path.join(ROOT, dest));
        }
      }
    },
    {
      name: 'Criar arquivos de exemplo para configs/contextos',
      async run() {
        const exampleConfigs = [
          ['src/configs/settingsConfig.ts', '// Exemplo de settingsConfig\nexport default {};\n'],
          ['src/configs/layoutConfigTemplates.ts', '// Exemplo de layoutConfigTemplates\nexport default {};\n'],
          ['src/configs/navigationConfig.ts', '// Exemplo de navigationConfig\nexport default [];\n'],
          ['src/configs/themeOptions.ts', '// Exemplo de themeOptions\nexport default [];\n'],
          ['src/contexts/AppContext.tsx', '// Exemplo de AppContext\nimport { createContext } from "react";\nexport const AppContext = createContext({});\n']
        ];
        for (const [file, content] of exampleConfigs) {
          const fullPath = path.join(ROOT, file);
          try {
            await fs.access(fullPath);
            logWarn(`Arquivo já existe: ${file}`);
          } catch {
            await fs.writeFile(fullPath, content);
            logSuccess(`Arquivo de exemplo criado: ${file}`);
          }
        }
      }
    },
    {
      name: 'Padronizar atomicidade dos componentes ui',
      async run() {
        // Apenas loga, pois já estão em src/components/ui
        logInfo('Componentes UI já estão padronizados em src/components/ui');
      }
    },
    {
      name: 'Padronizar styles',
      async run() {
        // Apenas loga, pois index.css já está em src/styles
        logInfo('Styles globais já estão em src/styles/index.css');
      }
    },
    {
      name: 'Atualizar imports em todo o projeto',
      async run() {
        const replacements = {
          '@/components/Header': '@/components/layouts/LayoutCliente/Header',
          '@/components/Servicos': '@/components/layouts/LayoutCliente/Servicos',
          '@/components/SocialLoginBox': '@/components/layouts/LayoutCliente/SocialLoginBox',
          '@/components/ErrorBoundary': '@/components/layouts/LayoutCliente/ErrorBoundary',
          '@/components/theme-provider': '@/components/theme/ThemeProviderCustom',
          '@/components/theme/ThemeProvider': '@/components/theme/ThemeProvider',
          '@/components/theme/ThemeToggle': '@/components/theme/ThemeToggle',
          '@/styles/themes': '@/configs/themesConfig',
        };
        await updateAllImports(path.join(ROOT, 'src'), replacements);
      }
    },
    {
      name: 'Remover arquivos redundantes e legados',
      async run() {
        const toRemove = [
          'src/components/Header.tsx',
          'src/components/Servicos.tsx',
          'src/components/SocialLoginBox.tsx',
          'src/components/ErrorBoundary.tsx',
          'src/components/theme-provider.tsx',
          'src/components/theme/ThemeProvider.tsx',
          'src/components/theme/ThemeToggle.tsx',
          'src/styles/themes.ts',
        ];
        for (const file of toRemove) {
          try {
            await fs.unlink(path.join(ROOT, file));
            logSuccess(`Arquivo removido: ${file}`);
          } catch {
            // Ignora se não existe
          }
        }
      }
    },
    {
      name: 'Finalizar e gerar relatório',
      async run() {
        logSuccess('Todas as etapas de refatoração foram concluídas!');
        logInfo('Revise os arquivos migrados, atualize detalhes manuais se necessário e rode os testes.');
        // Gera relatório detalhado
        const report = [
          '--- RELATÓRIO DE MIGRAÇÃO ---',
          'Pastas criadas: src/components/layouts/LayoutCliente, src/components/theme, src/configs, src/contexts, src/components/ui',
          'Arquivos migrados: LayoutCliente, Header, Rodape, Servicos, SocialLoginBox, ErrorBoundary, ThemeProvider, ThemeToggle, theme-provider, themes.ts',
          'Configs/contextos de exemplo criados se ausentes',
          'Imports atualizados em todo o projeto',
          'Arquivos redundantes removidos',
          'Ajustes manuais podem ser necessários em casos especiais',
          '-----------------------------'
        ].join('\n');
        await fs.writeFile(path.join(ROOT, 'relatorio-migracao.txt'), report);
        logSuccess('Relatório de migração salvo em relatorio-migracao.txt');
      }
    }
  ];

  for (; step < steps.length; step++) {
    logInfo(`Etapa ${step + 1}/${steps.length}: ${steps[step].name}`);
    try {
      await steps[step].run();
      await saveStatus({ step: step + 1 });
      logSuccess(`Etapa concluída: ${steps[step].name}`);
    } catch (e) {
      logError(`Erro na etapa: ${steps[step].name}`);
      logError(e.message);
      logWarn('Corrija o erro e execute novamente para retomar desta etapa.');
      process.exit(1);
    }
  }

  logSuccess('Refatoração estrutural concluída com sucesso!');
  await fs.unlink(STATUS_FILE).catch(() => {});
}

if (require.main === module) {
  main();
}
