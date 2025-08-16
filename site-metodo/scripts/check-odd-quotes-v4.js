const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('prisma/db/dev.db');
db.all('SELECT id,v4 FROM casbin_rule', (e, rows) => {
  if (e) { console.error(e); process.exit(2); }
  let found = false;
  rows.forEach(r => {
    const v = String(r.v4 || '');
    const cnt = (v.split('"').length - 1);
    if (cnt % 2 === 1) {
      found = true;
      console.log('ODD_QUOTES id=', r.id, 'count=', cnt, 'v4=', v);
    }
  });
  if (!found) console.log('No odd-quote rows found');
  db.close();
});
