import { NextRequest, NextResponse } from 'next/server'
import { getEnforcer } from '@/lib/abac/enforcer-abac-puro'
import { withABACAuthorization } from '@/lib/abac/middleware'
import { z } from 'zod'

/**
 * API Routes for ABAC Policy Management (renamed from roles for pure ABAC)
 * This endpoint manages user policies instead of roles
 */

const PolicyAssignmentSchema = z.object({
  userEmail: z.string().email(),
  resource: z.string(),
  action: z.string(),
  effect: z.enum(['allow', 'deny']).default('allow'),
})

/**
 * GET /api/abac/roles - Get all policies (kept URL for backward compatibility)
 */
export async function GET() {
  try {
    const enforcer = await getEnforcer()
    const policies = await enforcer.getPolicy()

    return NextResponse.json({
      success: true,
      data: policies,
    })
  } catch (_error) {
    console.error('Error fetching policies:', String(_error))
    return NextResponse.json(
      {
        success: false,
        error: 'Falha ao buscar políticas',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/abac/roles - Assign policy to user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userEmail, resource, action, effect } = PolicyAssignmentSchema.parse(body)

    const enforcer = await getEnforcer()
    const added = await enforcer.addPolicy('p', userEmail, resource, action, effect)

    if (added) {
      return NextResponse.json({
        success: true,
        message: `Policy '${effect}' for '${action}' on '${resource}' assigned to user '${userEmail}' successfully`,
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Policy assignment already exists or failed' },
        { status: 400 }
      )
    }
  } catch (_error) {
    if (_error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: _error.issues },
        { status: 400 }
      )
    }

    console.error('Error assigning policy:', String(_error))
    return NextResponse.json({ success: false, error: 'Failed to assign policy' }, { status: 500 })
  }
}

/**
 * DELETE /api/abac/roles - Remove policy from user
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userEmail, resource, action } = PolicyAssignmentSchema.parse(body)

    const enforcer = await getEnforcer()
    const removed = await enforcer.removePolicy('p', userEmail, resource, action)

    if (removed) {
      return NextResponse.json({
        success: true,
        message: `Policy for '${action}' on '${resource}' removed from user '${userEmail}' successfully`,
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Policy not found' },
        { status: 404 }
      )
    }
  } catch (_error) {
    if (_error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: _error.issues },
        { status: 400 }
      )
    }

    console.error('Error removing policy:', String(_error))
    return NextResponse.json({ success: false, error: 'Failed to remove policy' }, { status: 500 })
  }
}

// Protect all endpoints with admin authorization
export const protectedGET = withABACAuthorization(GET, 'read')
export const protectedPOST = withABACAuthorization(POST, 'write')
export const protectedDELETE = withABACAuthorization(DELETE, 'delete')
