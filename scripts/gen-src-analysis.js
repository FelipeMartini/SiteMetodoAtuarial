#!/usr/bin/env node
const fs=require('fs'),path=require('path');
const x=path.join(process.cwd(),'XLOGS');
const files=fs.readdirSync(x).filter(f=>/^filtered-orphans-src-.*\.json$/.test(f)).sort();
if(!files.length){console.error('no file');process.exit(1)}
const p=path.join(x,files[files.length-1]);
const d=JSON.parse(fs.readFileSync(p,'utf8'));
const items=d.items;
const byKind={};const byRec={};
for(const it of items){byKind[it.kind]=(byKind[it.kind]||0)+1;byRec[it.recommendation]=(byRec[it.recommendation]||0)+1}
items.sort((a,b)=>b.count-a.count);
const top=items.slice(0,50);
const out={source:p,generatedAt:new Date().toISOString(),total:items.length,byKind,byRec,top};
const outPath=path.join(x,'src-analysis-'+Date.now()+'.json');fs.writeFileSync(outPath,JSON.stringify(out,null,2));
console.log('wrote',outPath);
