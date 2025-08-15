// Cria um usuário (se necessário) e uma sessão para testes locais
const {PrismaClient} = require('@prisma/client')
const { randomUUID } = require('crypto')
;(async ()=>{
  const prisma = new PrismaClient()
  try{
    await prisma.$connect()
    const email = process.env.DEBUG_TEST_EMAIL || 'devtest@example.com'
    let user = await prisma.user.findUnique({ where: { email } })
    if(!user){
      user = await prisma.user.create({ data: { email, name: 'Dev Test User', isActive: true } })
      console.log('created user', user.id, user.email)
    } else {
      console.log('found user', user.id, user.email)
    }

    const token = 'dbg-'+randomUUID()
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 dias

    const session = await prisma.session.create({ data: { sessionToken: token, userId: user.id, expires } })
    console.log('created session', { id: session.id, sessionToken: session.sessionToken, userId: session.userId, expires: session.expires })

    console.log('\nUse o comando abaixo para testar o endpoint:')
    console.log(`curl -i -H "Cookie: authjs.session-token=${token};" http://localhost:3000/api/auth/session`)
  }catch(e){
    console.error('erro', e)
    process.exit(1)
  }finally{
    await prisma.$disconnect()
  }
})()
