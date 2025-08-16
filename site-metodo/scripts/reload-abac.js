(async () => {
  try {
    process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/db/dev.db'
    const mod = await import('../src/lib/abac/enforcer-abac-puro')
    const res = await mod.reloadABACPolicies()
    console.log('reloadABACPolicies:', res)
    process.exit(0)
  } catch (err) {
    console.error('reload failed', err)
    process.exit(1)
  }
})()
