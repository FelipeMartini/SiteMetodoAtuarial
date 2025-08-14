#!/usr/bin/env node
const path = require('path')
let prisma
try {
  prisma = require(path.resolve(__dirname, '..', 'site-metodo', 'prisma', 'client.ts')).prisma
} catch (e){
  prisma = require(path.resolve(__dirname, '..', 'site-metodo', 'node_modules', '.prisma', 'client')).prisma
}
const { Helper } = require(path.resolve(__dirname, '..', 'site-metodo', 'node_modules', 'casbin', 'lib', 'cjs', 'persist', 'helper.js'))

function quoteIfNeeded(s){
  if (s === null || s === undefined) return ''
  const str = String(s)
  // if contains comma or space or braces, wrap in quotes
  if (/[,\s\{\}\(\)\[\]]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

async function main(){
  const rows = await prisma.casbinRule.findMany({})
  console.log('rows', rows.length)
  for (const r of rows){
    const parts = [r.ptype, r.v0, r.v1, r.v2, r.v3, r.v4, r.v5]
    const line = parts.filter(p => p !== null && p !== undefined && p !== '').map(p => quoteIfNeeded(p)).join(',')
    try{
      // we pass a fake model with minimal structure expected by Helper
      const model = { model: new Map([[r.ptype, new Map([[r.ptype, { policy: [], get: ()=>({ policy: [] }) }]])]]) }
      Helper.loadPolicyLine(line, model)
    }catch(e){
      console.error('Parse error at id', r.id, 'line:', line)
      console.error(e.stack)
      process.exit(1)
    }
  }
  console.log('All parsed OK')
  process.exit(0)
}

main().catch(e=>{console.error(e);process.exit(1)})
