// Diagnóstico: simula loadPolicyLine do adapter para encontrar regras que quebram o parser
const { newModelFromString } = require('casbin');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ABAC_MODEL = `
[request_definition]
r = sub, obj, act, ctx

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) || r.sub == p.sub || keyMatch2(r.sub, p.sub) || \
    (r.obj == p.obj || keyMatch2(r.obj, p.obj)) && \
    (r.act == p.act || keyMatch2(r.act, p.act)) && \
    eval(p.eft) && \
    contextMatch(r.ctx, p.ctx)
`;

function toSafeString(val){
  if(val===null || val===undefined) return '';
  if(typeof val !== 'string') val = String(val);
  return val;
}

function hexOf(s){
  if(s===null||s===undefined) return '';
  return Buffer.from(String(s), 'utf8').toString('hex');
}

async function main(){
  const model = newModelFromString(ABAC_MODEL);
  // some casbin implementations expose loadPolicyLine on model
  if(typeof model.loadPolicyLine !== 'function'){
    console.error('Model does not expose loadPolicyLine; cannot run adapter-level parse.');
    process.exit(2);
  }

  const rows = await prisma.casbinRule.findMany({ select: { id: true, ptype: true, v0: true, v1: true, v2: true, v3: true, v4: true, v5: true } });
  const problems = [];
  for(const r of rows){
    // build line similar to adapter: "ptype, v0, v1, v2, v3, v4, v5" (comma+space)
    const parts = [r.ptype, r.v0, r.v1, r.v2, r.v3, r.v4, r.v5].map(toSafeString);
    const line = parts.join(', ');
    try{
      model.loadPolicyLine(line, model);
    }catch(err){
      problems.push({ id: r.id, error: err && err.message, row: r, hex: { v0: hexOf(r.v0), v1: hexOf(r.v1), v2: hexOf(r.v2), v3: hexOf(r.v3), v4: hexOf(r.v4), v5: hexOf(r.v5) } });
    }
  }

  if(problems.length===0) console.log('NO_ADAPTER_PARSE_ISSUES');
  else console.log(JSON.stringify(problems,null,2));

  await prisma.$disconnect();
}

main().catch(async err=>{ console.error(err); await prisma.$disconnect(); process.exit(1); });
