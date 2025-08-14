const { newModelFromString, newEnforcer } = require('casbin');
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

async function main(){
  const rows = await prisma.casbinRule.findMany({ select: { id: true, ptype: true, v0: true, v1: true, v2: true, v3: true, v4: true, v5: true } });
  const broken = [];
  const m = newModelFromString(ABAC_MODEL);
  for(const r of rows){
    if(r.ptype !== 'p') continue;
    const policy = [];
    // order: v0..v5 but we use up to v4 as model defines p = sub,obj,act,eft
    policy.push(r.v0 ?? '');
    policy.push(r.v1 ?? '');
    policy.push(r.v2 ?? '');
    policy.push(r.v3 ?? '');
    // include ctx in v4 if present by passing it as 5th arg? addPolicy accepts variable args
    if(r.v4) policy.push(r.v4);
    try{
      const e = await newEnforcer(m);
      // add custom functions stub to avoid eval issues
      // no need to add functions for parsing
      const added = await e.addPolicy(...policy);
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
