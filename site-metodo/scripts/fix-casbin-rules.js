#!/usr/bin/env node
/*
 Safe fixer for casbin_rule table.
 Usage:
  node scripts/fix-casbin-rules.js --dry-run     (only report)
  node scripts/fix-casbin-rules.js --apply       (apply fixes)
  node scripts/fix-casbin-rules.js --drop-bad    (delete irreparably bad rows)

 The script relies on sqlite3 CLI available in PATH.
 It creates a CSV backup in XLOGS before any change.
*/

require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run') || (!args.includes('--apply') && !args.includes('--drop-bad'));
const APPLY = args.includes('--apply');
const DROP = args.includes('--drop-bad');

const cwd = process.cwd();
const dbUrl = process.env.DATABASE_URL || 'file:./prisma/db/dev.db';
let dbPath = dbUrl.startsWith('file:') ? dbUrl.slice(5) : dbUrl;
if (!path.isAbsolute(dbPath)) dbPath = path.resolve(cwd, dbPath);

function sqlEscape(s){
  if(s===null || s===undefined) return '';
  return String(s).replace(/'/g, "''");
}

function removeControlChars(s){
  if(s===null || s===undefined) return '';
  return String(s).replace(/[\x00\x09\x0A\x0D]/g, '');
}

function looksLikeJson(s){
  if(!s) return false;
  const t = s.trim();
  return (t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'));
}

function isValidJson(s){
  try{ JSON.parse(s); return true;}catch(e){return false}
}

(async()=>{
  console.log('DB path resolved to:', dbPath);
  if(!fs.existsSync(dbPath)){
    console.error('ERROR: DB not found at', dbPath);
    process.exit(2);
  }
  // backup
  fs.mkdirSync(path.join(cwd,'XLOGS'),{recursive:true});
  const ts = new Date().toISOString().replace(/[:.]/g,'-');
  const backup = path.join(cwd,`XLOGS/casbin_rule-backup-${ts}.csv`);
  console.log('Creating CSV backup:', backup);
  execSync(`sqlite3 "${dbPath}" ".mode csv" ".headers on" \"SELECT * FROM casbin_rule;\" > \"${backup}\"`);

  // read rows via sqlite3 TSV
  const tsvFile = path.join(cwd,`XLOGS/casbin_rule_tsv-${ts}.tsv`);
  execSync(`sqlite3 "${dbPath}" -separator $'\t' \"SELECT id, ifnull(v0,''), ifnull(v1,''), ifnull(v2,''), ifnull(v3,''), ifnull(v4,''), ifnull(v5,'') FROM casbin_rule;\" > \"${tsvFile}\"`);
  const lines = fs.readFileSync(tsvFile,'utf8').split(/\r?\n/).filter(Boolean);
  console.log('Found rows:', lines.length);

  const report = [];
  for(const line of lines){
    const parts = line.split('\t');
    const id = parts[0];
    const cols = parts.slice(1,7);
    const original = cols.slice();
    const sanitized = cols.map(c=>removeControlChars(c).trim());
    const changes = [];
    for(let i=0;i<cols.length;i++){
      if(String(original[i])!==String(sanitized[i])) changes.push({col:`v${i}`, from:original[i], to:sanitized[i]});
    }
    // check JSON v4
    let v4 = sanitized[4] || '';
    let v4Problem = false;
    if(v4){
      if(looksLikeJson(v4) && !isValidJson(v4)){
        v4Problem = true;
        // try a naive fix: replace single quotes with double quotes and unescape stray backslashes
        const try1 = v4.replace(/'/g,'"').replace(/\\n/g,'\\\n');
        if(isValidJson(try1)){
          changes.push({col:'v4', from:v4, to:try1, note:'naive-quote-fix'});
          v4 = try1;
          sanitized[4]=v4;
          v4Problem=false;
        }
      }
    }

    // detect odd number of quotes
    const quoteCount = (String(sanitized[4]||'').split('"').length-1);
    const oddQuotes = (quoteCount%2!==0);

    const rowOk = (changes.length===0 && !v4Problem && !oddQuotes);
    report.push({id,changes, v4Problem, oddQuotes, sanitized});
  }

  // Summarize
  const bad = report.filter(r=>r.changes.length>0 || r.v4Problem || r.oddQuotes);
  console.log('Total rows:', report.length, 'Rows flagged:', bad.length);
  const rptFile = path.join(cwd,`XLOGS/casbin-fix-report-${ts}.json`);
  fs.writeFileSync(rptFile, JSON.stringify({ts: new Date().toISOString(), dbPath, total:report.length, flagged:bad.length, details:bad},null,2),'utf8');
  console.log('Wrote report to', rptFile);

  if(DRY){
    console.log('Dry run complete. To apply fixes run with --apply or to drop bad rows run with --drop-bad');
    process.exit(0);
  }

  if(DROP){
    // delete rows with serious problems
    const toDrop = report.filter(r=>r.v4Problem || r.oddQuotes).map(r=>r.id);
    if(toDrop.length===0){ console.log('No rows to drop'); process.exit(0); }
    console.log('Dropping rows:', toDrop);
    for(const id of toDrop){
      execSync(`sqlite3 "${dbPath}" \"DELETE FROM casbin_rule WHERE id=${id};\"`);
    }
    console.log('Dropped', toDrop.length, 'rows');
    process.exit(0);
  }

  if(APPLY){
    // apply sanitized changes (only those with changes)
    const toUpdate = report.filter(r=>r.changes.length>0 && !(r.v4Problem || r.oddQuotes));
    console.log('Updating', toUpdate.length, 'rows');
    for(const r of toUpdate){
      const vals = r.sanitized.map(v=>sqlEscape(v));
      const sql = `UPDATE casbin_rule SET v0='${vals[0]}', v1='${vals[1]}', v2='${vals[2]}', v3='${vals[3]}', v4='${vals[4]}', v5='${vals[5]}' WHERE id=${r.id};`;
      execSync(`sqlite3 "${dbPath}" \"${sql}\"`);
    }
    console.log('Applied updates:', toUpdate.length);
  }

  console.log('Done.');
})();
