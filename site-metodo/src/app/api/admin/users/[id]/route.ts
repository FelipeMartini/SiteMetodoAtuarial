import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: { id: string } }) {
	try {
		const id = params.id
		const user = await prisma.user.findUnique({ where: { id } as any })
		if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
		return NextResponse.json({ user })
	} catch (err) {
		console.error('GET /api/admin/users/[id] error', err)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}

