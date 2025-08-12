import { NextRequest, NextResponse } from 'next/server'
import { auth } from '../../../../../auth'
import { getEnforcer } from '@/lib/abac/enforcer'
import { z } from 'zod'

const CheckPermissionSchema = z.object({
  userEmail: z.string().email(),
  resource: z.string(),
  action: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = CheckPermissionSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
          details: result.error.issues,
        },
        { status: 400 }
      )
    }

    const { userEmail, resource, action } = result.data

    // Verify the requesting user can check this permission
    if (session.user.email !== userEmail) {
      // Only admins can check permissions for other users
      const enforcer = await getEnforcer()
      const adminCheck = await enforcer.enforce({
        subject: session.user.email,
        object: '/admin/abac',
        action: 'manage',
      })

      if (!adminCheck.allowed) {
        return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
      }
    }

    // Check the actual permission
    const enforcer = await getEnforcer()
    const authResult = await enforcer.enforce({
      subject: userEmail,
      object: resource,
      action: action,
    })

    return NextResponse.json({
      success: true,
      allowed: authResult.allowed,
      reason: authResult.reason,
      timestamp: authResult.timestamp,
    })
  } catch {
    console.error('Error checking permission:', String(_error))
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    )
  }
}
