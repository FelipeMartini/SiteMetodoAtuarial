(async()=>{
  try{
    const { newEnforcer } = require('casbin');
    const { PrismaAdapter } = require('casbin-prisma-adapter');
    const { PrismaClient } = require('@prisma/client');
    const path = require('path');
    const prisma = new PrismaClient();
    const adapter = await PrismaAdapter.newAdapter(prisma);
    const modelPath = path.resolve(process.cwd(),'src/lib/abac/abac-model.conf');
    const enforcer = await newEnforcer(modelPath);
    if(typeof enforcer.setAdapter === 'function') await enforcer.setAdapter(adapter);
    try{
      await enforcer.loadPolicy();
      console.log('LOAD_OK', enforcer.getPolicy().length);
    }catch(errLoad){
      console.error('LOAD_ERR', errLoad && errLoad.message);
      console.error(errLoad);
      console.log('Attempting manual per-row add to find offending policy...');
      const rows = await prisma.casbinRule.findMany();
      for(const r of rows){
        const parts = [];
        if(r.v0) parts.push(String(r.v0));
        if(r.v1) parts.push(String(r.v1));
        if(r.v2) parts.push(String(r.v2));
        if(r.v3) parts.push(String(r.v3));
        if(r.v4) parts.push(String(r.v4));
        if(r.v5) parts.push(String(r.v5));
        try{
          await enforcer.addPolicy(...parts);
        }catch(errAdd){
          console.error('ADD_ERR on id='+r.id, 'parts=', parts, 'err=', errAdd && errAdd.message);
          break;
        }
      }
    }
    await prisma.$disconnect();
    process.exit(0);
  }catch(e){
    console.error('FATAL', e && e.message);
    process.exit(1);
  }
})();
