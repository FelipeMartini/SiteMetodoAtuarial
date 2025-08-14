#!/usr/bin/env npx tsx

import { prisma } from '../src/lib/prisma'

async function main() {
  const policies = await prisma.casbinRule.findMany()
  console.log('Total policies:', policies.length)
  policies.forEach((p, i) => {
    console.log(`\nPolicy #${i + 1}:`)
    console.log('id:', p.id)
    console.log('ptype:', p.ptype)
    console.log('v0:', p.v0)
    console.log('v1:', p.v1)
    console.log('v2:', p.v2)
    console.log('v3:', p.v3)
    console.log('v4:', p.v4)
    console.log('v5:', p.v5)
  })
}

main().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
