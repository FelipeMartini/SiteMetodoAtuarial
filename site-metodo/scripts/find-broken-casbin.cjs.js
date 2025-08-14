// CommonJS script to test each casbin_rule by attempting to load it into a Casbin model
const { newModelFromString, newEnforcer } = require('casbin');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(){
  const rows = await prisma.casbinRule.findMany({ select: { id: true, ptype: true, v0: true, v1: true, v2: true, v3: true, v4: true, v5: true } });
  const modelText = `[request_definition]\nq = sub, obj, act\n[policy_definition]\n p = sub, obj, act\n[policy_effect]\n e = some(where (p.eft == allow))\n[matchers]\n m = r.sub == p.sub && r.obj == p.obj && r.act == p.act`;
  const broken = [];
  for(const r of rows){
    try{
      // build a policy line depending on v fields
      const parts = [r.v0, r.v1, r.v2, r.v3, r.v4, r.v5].filter(x=>x!==null && x!==undefined && x!=='');
      // Use only first three for this model
      const p = parts.slice(0,3).join(',');
      const m = newModelFromString(modelText);
      const e = await newEnforcer(m);
      const added = await e.addPolicy(...parts.slice(0,3));
      // cleanup
      await e.clearPolicy();
    }catch(err){
      broken.push({id: r.id, error: err && err.message, row: r});
    }
  }
  if(broken.length===0) console.log('NO_BROKEN_RULES');
  else console.log(JSON.stringify(broken,null,2));
  await prisma.$disconnect();
}

main().catch(async err=>{ console.error(err); await prisma.$disconnect(); process.exit(1); });
