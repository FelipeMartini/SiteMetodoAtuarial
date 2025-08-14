#!/usr/bin/env node
/*
  Seed aggregator: executa seeds individuais existentes no prisma/ (idempotente)
  Este arquivo é referenciado por package.json -> prisma:seed
*/
import path from 'path'

async function run() {
  console.log('Running prisma aggregated seed...')

  // Importar e executar seed-abac-user.ts
  const seedAbacPath = path.resolve(__dirname, '..', 'seed-abac-user.ts')
  try {
    // Executar o seed via ts-node para garantir que o arquivo seja interpretado e execute seu main()
    const { execSync } = require('child_process')
    const cmd = `npx ts-node --compiler-options '{"module":"commonjs"}' "${seedAbacPath}"`
    console.log('Running:', cmd)
    execSync(cmd, { stdio: 'inherit' })
    console.log('seed-abac-user executed')
  } catch (err) {
    console.error('Error running seed-abac-user:', err)
    process.exit(1)
  }
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
