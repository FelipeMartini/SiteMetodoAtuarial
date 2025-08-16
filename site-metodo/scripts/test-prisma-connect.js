require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
(async ()=>{
  const prisma = new PrismaClient({ log: ['info','warn','error'] });
  try{
    await prisma.$connect();
    console.log('PRISMA CONNECTED');
    const r = await prisma.casbinRule.findMany({ take:1 });
    console.log('sample row', r);
  }catch(e){
    console.error('PRISMA ERROR', e);
    if(e && e.cause) console.error('CAUSE', e.cause);
  } finally{
    await prisma.$disconnect();
  }
})();
