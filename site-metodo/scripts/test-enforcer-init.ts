import { getEnforcer } from '@/lib/abac/enforcer-abac-puro'

async function main() {
  try {
    console.log('Testando getEnforcer()...')
    const enforcer = await getEnforcer()
    console.log('Enforcer obtained. policyCount:', (await enforcer.getPolicy()).length)
  } catch (err) {
    console.error('getEnforcer failed:', err)
    process.exit(1)
  }
}

main()
