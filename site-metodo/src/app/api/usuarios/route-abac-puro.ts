'use client'

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db as prisma } from '@/lib/prisma'
import { usuarioABACSchema, usuarioUpdateABACSchema } from '@/validators/abacSchemas'
import { checkABACPermission, hasPermission } from '@/lib/abac/enforcer'
import { rateLimit } from '@/utils/rateLimit'
import { withCors, withSecurityHeaders } from '@/utils/security'
import { structuredLogger } from '@/lib/logger'
import { getClientIP } from '@/lib/utils/ip'

/**
 * 🔐 UTILITÁRIO PARA EXTRAIR CONTEXTO ABAC DA REQUISIÇÃO
 */
function buildABACContext(req: NextRequest, session: any) {
  return {
    ip: getClientIP(req),
    userAgent: req.headers.get('user-agent') || 'Unknown',
    time: new Date().toISOString(),
    location: session?.user?.location || 'unknown',
    department: session?.user?.department || 'unknown',
    mfaVerified: session?.user?.mfaEnabled || false,
    sessionAge: session?.user?.lastLogin ? Date.now() - new Date(session.user.lastLogin).getTime() : 0
  }
}

// GET: Lista todos os usuários (ABAC: admin access)
export async function GET(req: NextRequest) {
  await rateLimit(req)
  
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificação ABAC: usuário pode listar usuários
    const context = buildABACContext(req, session)
    const authResult = await checkABACPermission(
      `user:${session.user.id}`,
      'resource:users',
      'list',
      context
    )

    if (!authResult.allowed) {
      structuredLogger.security('Unauthorized users list access attempt', 'medium', {
        userId: session.user.id,
        email: session.user.email,
        reason: authResult.reason,
        context
      })
      return NextResponse.json({ 
        error: 'Acesso negado',
        reason: authResult.reason 
      }, { status: 403 })
    }

    // Buscar usuários com atributos ABAC
    const usuarios = await prisma.user.findMany({
      select: { 
        id: true, 
        name: true, 
        email: true, 
        isActive: true, 
        department: true,
        location: true,
        jobTitle: true,
        validFrom: true,
        validUntil: true,
        createdAt: true,
        lastLoginAt: true,
        loginCount: true
      },
    })

    // Log da consulta para auditoria
    structuredLogger.audit('USERS_LISTED', {
      performedBy: session.user.id,
      ip: context.ip,
      userAgent: context.userAgent,
      resultCount: usuarios.length
    })

    return withCors(withSecurityHeaders(NextResponse.json({
      success: true,
      data: usuarios,
      count: usuarios.length
    })))

  } catch (error) {
    structuredLogger.error('Failed to list users', { 
      severity: 'high', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// POST: Cria novo usuário (ABAC: admin create users)
export async function POST(req: NextRequest) {
  await rateLimit(req)

  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificação ABAC: usuário pode criar usuários
    const context = buildABACContext(req, session)
    const authResult = await checkABACPermission(
      `user:${session.user.id}`,
      'resource:users',
      'create',
      context
    )

    if (!authResult.allowed) {
      structuredLogger.security('Unauthorized user creation attempt', 'medium', {
        userId: session.user.id,
        email: session.user.email,
        reason: authResult.reason,
        context
      })
      return NextResponse.json({ 
        error: 'Acesso negado',
        reason: authResult.reason 
      }, { status: 403 })
    }

    // Validar dados de entrada
    const body = await req.json()
    const parseResult = usuarioABACSchema.safeParse(body)
    
    if (!parseResult.success) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: parseResult.error.issues
      }, { status: 400 })
    }

    const userData = parseResult.data

    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (existingUser) {
      return NextResponse.json({
        error: 'Email já está em uso'
      }, { status: 409 })
    }

    // Criar usuário com atributos ABAC
    const newUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password, // Em produção, hash a senha
        department: userData.department,
        location: userData.location,
        jobTitle: userData.jobTitle,
        validFrom: userData.validFrom ? new Date(userData.validFrom) : null,
        validUntil: userData.validUntil ? new Date(userData.validUntil) : null,
        isActive: userData.isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        location: true,
        jobTitle: true,
        isActive: true,
        createdAt: true
      }
    })

    // Log da criação para auditoria
    structuredLogger.audit('USER_CREATED', {
      performedBy: session.user.id,
      targetUser: newUser.id,
      userData: {
        email: newUser.email,
        department: newUser.department,
        location: newUser.location
      },
      ip: context.ip,
      userAgent: context.userAgent
    })

    return withCors(withSecurityHeaders(NextResponse.json({
      success: true,
      data: newUser,
      message: 'Usuário criado com sucesso'
    }, { status: 201 })))

  } catch (error) {
    structuredLogger.error('Failed to create user', { 
      severity: 'high', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// PUT: Atualiza usuário (ABAC: admin update users)
export async function PUT(req: NextRequest) {
  await rateLimit(req)

  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Validar dados de entrada
    const body = await req.json()
    const parseResult = usuarioUpdateABACSchema.safeParse(body)
    
    if (!parseResult.success) {
      return NextResponse.json({
        error: 'Dados inválidos',
        details: parseResult.error.issues
      }, { status: 400 })
    }

    const updateData = parseResult.data
    const targetUserId = updateData.id

    // Verificação ABAC: usuário pode atualizar usuários
    const context = buildABACContext(req, session)
    const authResult = await checkABACPermission(
      `user:${session.user.id}`,
      `resource:users:${targetUserId}`,
      'update',
      context
    )

    if (!authResult.allowed) {
      structuredLogger.security('Unauthorized user update attempt', 'medium', {
        userId: session.user.id,
        targetUserId,
        reason: authResult.reason,
        context
      })
      return NextResponse.json({ 
        error: 'Acesso negado',
        reason: authResult.reason 
      }, { status: 403 })
    }

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: targetUserId }
    })

    if (!existingUser) {
      return NextResponse.json({
        error: 'Usuário não encontrado'
      }, { status: 404 })
    }

    // Preparar dados para atualização (remover id dos dados)
    const { id, ...dataToUpdate } = updateData

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...dataToUpdate,
        validFrom: dataToUpdate.validFrom ? new Date(dataToUpdate.validFrom) : undefined,
        validUntil: dataToUpdate.validUntil ? new Date(dataToUpdate.validUntil) : undefined,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        location: true,
        jobTitle: true,
        isActive: true,
        validFrom: true,
        validUntil: true,
        updatedAt: true
      }
    })

    // Log da atualização para auditoria
    structuredLogger.audit('USER_UPDATED', {
      performedBy: session.user.id,
      targetUser: targetUserId,
      changes: dataToUpdate,
      ip: context.ip,
      userAgent: context.userAgent
    })

    return withCors(withSecurityHeaders(NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Usuário atualizado com sucesso'
    })))

  } catch (error) {
    structuredLogger.error('Failed to update user', { 
      severity: 'high', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

// DELETE: Remove usuário (ABAC: admin delete users)
export async function DELETE(req: NextRequest) {
  await rateLimit(req)

  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json()
    const { id: targetUserId } = body

    if (!targetUserId) {
      return NextResponse.json({
        error: 'ID do usuário obrigatório'
      }, { status: 400 })
    }

    // Verificação ABAC: usuário pode deletar usuários
    const context = buildABACContext(req, session)
    const authResult = await checkABACPermission(
      `user:${session.user.id}`,
      `resource:users:${targetUserId}`,
      'delete',
      context
    )

    if (!authResult.allowed) {
      structuredLogger.security('Unauthorized user deletion attempt', 'high', {
        userId: session.user.id,
        targetUserId,
        reason: authResult.reason,
        context
      })
      return NextResponse.json({ 
        error: 'Acesso negado',
        reason: authResult.reason 
      }, { status: 403 })
    }

    // Verificar se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, name: true }
    })

    if (!existingUser) {
      return NextResponse.json({
        error: 'Usuário não encontrado'
      }, { status: 404 })
    }

    // Impedir que usuário delete a si mesmo
    if (targetUserId === session.user.id) {
      return NextResponse.json({
        error: 'Não é possível deletar sua própria conta'
      }, { status: 400 })
    }

    // Deletar usuário
    await prisma.user.delete({
      where: { id: targetUserId }
    })

    // Log da exclusão para auditoria
    structuredLogger.audit('USER_DELETED', {
      performedBy: session.user.id,
      targetUser: targetUserId,
      deletedUserData: {
        email: existingUser.email,
        name: existingUser.name
      },
      ip: context.ip,
      userAgent: context.userAgent
    })

    return withCors(withSecurityHeaders(NextResponse.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    })))

  } catch (error) {
    structuredLogger.error('Failed to delete user', { 
      severity: 'high', 
      error: error instanceof Error ? error.message : String(error) 
    })
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
