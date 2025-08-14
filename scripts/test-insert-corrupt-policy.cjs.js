#!/usr/bin/env node
const path = require('path')
const prisma = require(path.resolve(__dirname, '..', 'site-metodo', 'node_modules', '.prisma', 'client')).prisma

async function main(){
  console.log('Inserting corrupt policy entry...')
  const bad = await prisma.casbinRule.create({ data: { ptype: 'p', v0: 'user:bad', v1: 'some,object', v2: 'read', v3: 'allow', v4: '{"time":"*"}' } })
  console.log('Inserted id', bad.id)
  process.exit(0)
}

main().catch(e=>{console.error(e);process.exit(1)})
