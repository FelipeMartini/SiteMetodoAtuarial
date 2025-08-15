(async () => {
  try {
    const mod = await import('../src/app/api/auth/session/route')
    if (!mod || typeof mod.GET !== 'function') {
      console.error('route module does not export GET')
      process.exit(1)
    }
    // Mock NextRequest like in tests
    const req = { _sessionFromAuth: { user: { id: 'u-admin', email: 'felipemartinii@gmail.com', name: 'Felipe' } }, headers: { get: () => undefined } }
    const res = await mod.GET(req)
    console.log('status:', res.status)
    const json = await res.json()
    console.log('body:', json)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
