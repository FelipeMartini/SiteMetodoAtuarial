import { NextRequest, NextResponse } from 'next/server'
import { getEnforcer } from '@/lib/abac/enforcer'
import { withABACAuthorization } from '@/lib/abac/middleware'
import { z } from 'zod'

/**
 * API Routes for ABAC Policy Management
 */

const PolicySchema = z.object({
  subject: z.string(),
  object: z.string(),
  action: z.string(),
  effect: z.enum(['allow', 'deny']).default('allow'),
  conditions: z.string().optional(),
})

// const RoleAssignmentSchema = z.object({
//   userEmail: z.string().email(),
//   roleName: z.string()
// });

/**
 * GET /api/abac/policies - Get all policies
 */
export async function GET(): Promise<NextResponse> {
  try {
    const enforcer = await getEnforcer()
    const policies = await enforcer.getAllPolicies()

    return NextResponse.json({
      success: true,
      data: policies,
    })
  } catch {
    console.error('Error fetching policies:', "Unknown error")
    return NextResponse.json({ success: false, error: 'Failed to fetch policies' }, { status: 500 })
  }
}

/**
 * POST /api/abac/policies - Add new policy
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = PolicySchema.parse(body)

    const enforcer = await getEnforcer()
    const added = await enforcer.addPolicy({
      id: `policy_${Date.now()}`,
      subject: validatedData.subject,
      object: validatedData.object,
      action: validatedData.action,
      effect: validatedData.effect,
      conditions: validatedData.conditions,
      description: `Policy for ${validatedData.subject} to ${validatedData.action} ${validatedData.object}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    if (added) {
      return NextResponse.json({
        success: true,
        message: 'Policy added successfully',
      })
    } else {
      return NextResponse.json({ success: false, error: 'Failed to add policy' }, { status: 400 })
    }
  } catch {
    if (_error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: _error.issues },
        { status: 400 }
      )
    }

    console.error('Error adding policy:', "Unknown error")
    return NextResponse.json({ success: false, error: 'Failed to add policy' }, { status: 500 })
  }
}

/**
 * DELETE /api/abac/policies - Remove policy
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = PolicySchema.parse(body)

    const enforcer = await getEnforcer()
    const removed = await enforcer.removePolicy({
      id: `policy_temp`,
      subject: validatedData.subject,
      object: validatedData.object,
      action: validatedData.action,
      effect: validatedData.effect,
      description: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    if (removed) {
      return NextResponse.json({
        success: true,
        message: 'Policy removed successfully',
      })
    } else {
      return NextResponse.json({ success: false, error: 'Policy not found' }, { status: 404 })
    }
  } catch {
    if (_error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: _error.issues },
        { status: 400 }
      )
    }

    console.error('Error removing policy:', "Unknown error")
    return NextResponse.json({ success: false, error: 'Failed to remove policy' }, { status: 500 })
  }
}

// Protect all endpoints with admin authorization
export const protectedGET = withABACAuthorization(GET, 'read')
export const protectedPOST = withABACAuthorization(POST, 'write')
export const protectedDELETE = withABACAuthorization(DELETE, 'delete')
