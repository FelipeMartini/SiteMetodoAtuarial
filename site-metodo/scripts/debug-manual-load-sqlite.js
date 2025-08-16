#!/usr/bin/env node
require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
(async()=>{
  try{
    const dbUrl = process.env.DATABASE_URL || 'file:./prisma/db/dev.db';
    let dbPath = dbUrl.startsWith('file:') ? dbUrl.slice(5) : dbUrl;
    if(!path.isAbsolute(dbPath)) dbPath = path.resolve(process.cwd(), dbPath);
    console.log('Using DB path:', dbPath);
    if(!fs.existsSync(dbPath)) throw new Error('DB not found: '+dbPath);
    // Query casbin_rule rows via sqlite3 CLI, output as TSV
    const sql = `SELECT id, ifnull(v0,''), ifnull(v1,''), ifnull(v2,''), ifnull(v3,''), ifnull(v4,''), ifnull(v5,'') FROM casbin_rule;`;
    const cmd = `sqlite3 "${dbPath}" -separator "\t" "${sql}"`;
    console.log('Running sqlite3...');
    const out = execSync(cmd, { encoding: 'utf8', maxBuffer: 10*1024*1024 });
    const lines = out.split(/\r?\n/).filter(Boolean);
    console.log('Found rows:', lines.length);
    // Setup enforcer without adapter
    const { newEnforcer } = require('casbin');
    const modelPath = path.resolve(process.cwd(), 'src/lib/abac/abac-model.conf');
    const enforcer = await newEnforcer(modelPath);
    for(const line of lines){
      const cols = line.split('\t');
      const id = cols[0];
      const parts = cols.slice(1).filter((s)=>s!==null && s!==undefined && String(s)!=='') ;
      try{
        await enforcer.addPolicy(...parts);
      }catch(err){
        console.error('ADD_ERR id='+id, 'parts=', parts, 'err=', (err && err.message) || err);
        process.exit(2);
      }
    }
    console.log('All rows added OK, total policies:', enforcer.getPolicy().length);
    process.exit(0);
  }catch(e){
    console.error('FATAL', e && e.message, e && e.stack);
    process.exit(1);
  }
})();
