// Utilitário para importar elementos do auth.ts na raiz
// Facilita imports dentro de src/ sem usar caminhos relativos
// Minimal, cleaned auth file
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id'
import DiscordProvider from 'next-auth/providers/discord'
import FacebookProvider from 'next-auth/providers/facebook'
import AppleProvider from 'next-auth/providers/apple'
import Credentials from 'next-auth/providers/credentials'
import bcryptjs from 'bcryptjs'
import { signInSchema } from '@/lib/validation'
import prisma from '@/lib/prisma'
import { addABACPolicy } from '@/lib/abac/enforcer-abac-puro'

export const authOptions = {
	debug: process.env.NODE_ENV === 'development',
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'database',
		maxAge: 30 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
	},
	providers: [
		GoogleProvider({ clientId: process.env.AUTH_GOOGLE_ID!, clientSecret: process.env.AUTH_GOOGLE_SECRET! }),
		MicrosoftEntraID({ clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!, clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!, issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER! }),
		DiscordProvider({ clientId: process.env.AUTH_DISCORD_ID!, clientSecret: process.env.AUTH_DISCORD_SECRET! }),
		FacebookProvider({ clientId: process.env.AUTH_FACEBOOK_ID!, clientSecret: process.env.AUTH_FACEBOOK_SECRET! }),
		AppleProvider({ clientId: process.env.AUTH_APPLE_ID!, clientSecret: process.env.AUTH_APPLE_SECRET! }),
		(Credentials as any)({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials: any) {
				try {
					const { email, password } = await signInSchema.parseAsync(credentials)
					const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true, password: true, isActive: true, validFrom: true, validUntil: true, loginCount: true, failedLogins: true, lastLoginAt: true } })
					if (!user) return null
					const passwordMatch = await bcryptjs.compare(password, user.password || '')
					if (!passwordMatch) {
						await prisma.user.update({ where: { id: user.id }, data: { failedLogins: user.failedLogins + 1 } })
						return null
					}
					if (!user.isActive) return null
					const now = new Date()
					if (user.validFrom && now < user.validFrom) return null
					if (user.validUntil && now > user.validUntil) return null
					await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date(), loginCount: user.loginCount + 1, failedLogins: 0 } })
					return { id: user.id, email: user.email!, name: user.name, image: null } as any
				} catch (err) {
					console.error('Erro no authorize:', err)
					return null
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, account }: any) {
			if (user) {
				if (account?.provider !== 'credentials') {
					const dbUser = await prisma.user.findUnique({ where: { email: user.email! }, select: { id: true, name: true, email: true } })
					if (dbUser) {
						token.id = dbUser.id
						token.email = dbUser.email ?? ''
						token.name = dbUser.name
					}
				} else {
					token.id = user.id
				}
			}
			return token
		},
		async session({ session, token }: any) {
			if (session?.user && token?.id) {
				session.user.id = token.id as string
			}
			return session
		},
	},
	pages: {
		signIn: '/auth/signin',
		signOut: '/auth/signout',
		error: '/auth/error',
		verifyRequest: '/auth/verify-request',
		newUser: '/auth/new-user',
	},
	events: {
		async createUser({ user }: any) {
			try {
				if (user?.email) {
					await addABACPolicy(user.email, 'session:read', 'read', 'allow')
				}
			} catch (err) {
				console.error('Failed to add ABAC policies for new user:', err)
			}
		},
	},
}

const _nextAuthExports: any = NextAuth(authOptions as any)
export const handlers = _nextAuthExports.handlers ?? _nextAuthExports
export const signIn = _nextAuthExports.signIn ?? (async () => undefined)
export const signOut = _nextAuthExports.signOut ?? (async () => undefined)

export async function auth() {
	try {
		const mod = await import('next-auth')
		if (mod && typeof (mod as any).getServerSession === 'function') {
			return await (mod as any).getServerSession()
		}
	} catch (error) {
		console.warn('auth() helper failed to get server session:', error)
	}
	return null
}
