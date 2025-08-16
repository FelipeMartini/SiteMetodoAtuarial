#!/usr/bin/env node

(async()=>{
  try{
    require('dotenv').config();
    const fs = require('fs');
    const path = require('path');
    console.log('CWD:', process.cwd());
    console.log('DATABASE_URL env:', process.env.DATABASE_URL);
    // Resolve sqlite file if file: prefix
    let dbPath = process.env.DATABASE_URL || '';
    if(dbPath.startsWith('file:')){
      dbPath = dbPath.slice('file:'.length);
    }
    // If relative, resolve against cwd
    if(!path.isAbsolute(dbPath)) dbPath = path.resolve(process.cwd(), dbPath);
    console.log('Resolved DB path:', dbPath);
    try{
      console.log('Exists?', fs.existsSync(dbPath));
      const stat = fs.statSync(dbPath);
      console.log('Stat size:', stat.size, 'mode:', (stat.mode & 0o777).toString(8));
    }catch(e){
      console.error('Stat/exists error', e && e.message);
    }

    // Quick sqlite3 probe
    const { execSync } = require('child_process');
    try{
      const out = execSync(`sqlite3 "${dbPath}" "SELECT COUNT(*) FROM casbin_rule;"`,{encoding:'utf8',timeout:20000});
      console.log('sqlite3 COUNT casbin_rule =>', out.trim());
    }catch(e){
      console.error('sqlite3 probe failed:', e && e.message);
    }

    // Now attempt Prisma connection
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    try{
      const c = await prisma.$queryRaw`SELECT COUNT(*) as cnt FROM casbin_rule`;
      console.log('Prisma raw count result:', c);
    }catch(e){
      console.error('Prisma query failed:', e && e.message);
    }
    await prisma.$disconnect();
    process.exit(0);
  }catch(e){
    console.error('FATAL', e && e.message);
    process.exit(1);
  }
})();
