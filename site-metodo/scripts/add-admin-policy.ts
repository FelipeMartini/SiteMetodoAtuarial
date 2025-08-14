#!/usr/bin/env npx tsx

import { addABACPolicy, reloadABACPolicies } from '../src/lib/abac/enforcer-abac-puro'

async function main() {
  const userId = 'cmeapbby0000083m9znk3vk5f' // ID observado nos logs

  console.log('Adicionando política admin para', userId)

  const added = await addABACPolicy(
    `user:${userId}`,
    '*',
    '*',
    'allow',
    { department: 'admin', location: '*', time: '*' }
  )

  if (added) {
    console.log('Política adicionada com sucesso, recarregando políticas...')
    await reloadABACPolicies()
    console.log('Políticas recarregadas')
  } else {
    console.error('Falha ao adicionar política')
  }
}

main().catch(err => {
  console.error('Erro no script:', err)
  process.exit(1)
})
