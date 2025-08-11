import { NextRequest, NextResponse } from 'next/server';
import { getEnforcer } from '@/lib/abac/enforcer';
import { withABACAuthorization } from '@/lib/abac/middleware';
import { z } from 'zod';

/**
 * API Routes for ABAC Role Management
 */

const RoleAssignmentSchema = z.object({
  userEmail: z.string().email(),
  roleName: z.string()
});

const UserRolesQuerySchema = z.object({
  userEmail: z.string().email().optional(),
  roleName: z.string().optional()
});

/**
 * GET /api/abac/roles - Get roles for user or users for role
 */
export async function GET() {
  try {
    const roleAssignments = await prisma.userRole.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true,
          }
        },
        role: {
          select: {
            name: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: roleAssignments.map(assignment => ({
        userEmail: assignment.user.email,
        userName: assignment.user.name,
        roleName: assignment.role.name,
        assignedAt: assignment.assignedAt
      }))
    });
  } catch (error) {
    console.error('Error fetching role assignments:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Falha ao buscar atribuições de roles' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/abac/roles - Assign role to user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, roleName } = RoleAssignmentSchema.parse(body);
    
    const enforcer = await getEnforcer();
    const added = await enforcer.addRoleForUser(userEmail, roleName);

    if (added) {
      return NextResponse.json({
        success: true,
        message: `Role '${roleName}' assigned to user '${userEmail}' successfully`
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Role assignment already exists or failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error assigning role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to assign role' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/abac/roles - Remove role from user
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, roleName } = RoleAssignmentSchema.parse(body);
    
    const enforcer = await getEnforcer();
    const removed = await enforcer.deleteRoleForUser(userEmail, roleName);

    if (removed) {
      return NextResponse.json({
        success: true,
        message: `Role '${roleName}' removed from user '${userEmail}' successfully`
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Role assignment not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }
    
    console.error('Error removing role:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove role' },
      { status: 500 }
    );
  }
}

// Protect all endpoints with admin authorization
export const protectedGET = withABACAuthorization(GET, 'read');
export const protectedPOST = withABACAuthorization(POST, 'write');
export const protectedDELETE = withABACAuthorization(DELETE, 'delete');
