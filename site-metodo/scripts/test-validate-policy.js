require('dotenv').config();
const { validatePolicy, sanitizePolicyFields } = require('../src/lib/abac/validatePolicy');

const tests = [
  ['john@example.com','session:read','read','allow','{"time":"*","location":"*"}',''],
  ['bad@a.com','something','read','allow','{"time":"","location":"*}',''],
  ['u','o','a','allow','{"malformed": }','']
];

for(const t of tests){
  const res = validatePolicy(t);
  console.log('TEST', t[0], '=>', res);
}
