import { jest } from '@jest/globals'
import { GET as sessionGET } from '@/app/api/auth/session/route'
import * as abac from '@/lib/abac/enforcer-abac-puro'

// Mock NextRequest/NextResponse shapes used by the route
function makeReqWithSession(session: any) {
  return {
    headers: {
      get: (k: string) => undefined
    },
    _sessionFromAuth: session
  } as any
}

describe('Auth + ABAC integration', () => {
  afterEach(() => jest.restoreAllMocks())

  test('returns 200 when session exists and ABAC allows session:read for email', async () => {
    const user = { id: 'u1', email: 'test@example.com', name: 'Test' }
    jest.spyOn(abac, 'checkABACPermission').mockResolvedValue({ allowed: true, reason: 'ok', appliedPolicies: [], context: {}, timestamp: new Date(), responseTime: 1 })
    const req = makeReqWithSession({ user })
    const res = await sessionGET(req as any)
    // NextResponse.json returns a Response-like object in runtime; for test,
    // the route returns NextResponse which in this environment is not available.
    // We assert that it does not throw and returns an object with status 200
    expect(res.status).toBe(200)
  })

  test('returns 403 when session exists but ABAC denies and dev fallback disabled', async () => {
    const user = { id: 'u2', email: 'deny@example.com', name: 'Deny' }
    jest.spyOn(abac, 'checkABACPermission').mockResolvedValue({ allowed: false, reason: 'denied', appliedPolicies: [], context: {}, timestamp: new Date(), responseTime: 1 })
    process.env.ABAC_ALLOW_DEV_FALLBACK = 'false'
    const req = makeReqWithSession({ user })
    const res = await sessionGET(req as any)
    expect(res.status).toBe(403)
  })
})
