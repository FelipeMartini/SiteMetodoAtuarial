// Utilitário para importar elementos do auth.ts na raiz
// Facilita imports dentro de src/ sem usar caminhos relativos

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
import { checkABACPermission, addABACPolicy } from '@/lib/abac/enforcer-abac-puro'

// Startup checks: log presence of OAuth env vars to help diagnose Configuration errors
try {
	const googleOk = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)
	const msOk = Boolean(process.env.AUTH_MICROSOFT_ENTRA_ID_ID && process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET && process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER)
	console.info('[auth] provider config:', { google: googleOk, microsoftEntra: msOk })
	if (!googleOk) console.warn('[auth] AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET is missing or empty in env')
} catch (err) {
	console.warn('[auth] failed to read provider env vars', err)
}

// Note: avoid exporting a name `auth` from the NextAuth destructure because
// we provide a compatibility server helper function `auth()` below. Exporting
// both causes `Identifier 'auth' has already been declared` during module parse.
export const { handlers, signIn, signOut } = NextAuth({
	debug: process.env.NODE_ENV === 'development',
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: 'database',
		maxAge: 30 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
	},
	providers: [
		GoogleProvider({
			clientId: process.env.AUTH_GOOGLE_ID!,
			clientSecret: process.env.AUTH_GOOGLE_SECRET!,
			allowDangerousEmailAccountLinking: process.env.NODE_ENV === 'development',
		}),
		MicrosoftEntraID({
			clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
			clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
			issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
			allowDangerousEmailAccountLinking: process.env.NODE_ENV === 'development',
		}),
		DiscordProvider({
			clientId: process.env.AUTH_DISCORD_ID!,
			clientSecret: process.env.AUTH_DISCORD_SECRET!,
			allowDangerousEmailAccountLinking: process.env.NODE_ENV === 'development',
		}),
		FacebookProvider({
			clientId: process.env.AUTH_FACEBOOK_ID!,
			clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
			allowDangerousEmailAccountLinking: process.env.NODE_ENV === 'development',
		}),
		AppleProvider({
			clientId: process.env.AUTH_APPLE_ID!,
			clientSecret: process.env.AUTH_APPLE_SECRET!,
			allowDangerousEmailAccountLinking: process.env.NODE_ENV === 'development',
		}),
		Credentials({
			name: 'credentials',
			credentials: {
				email: { label: 'Email', type: 'email', placeholder: 'admin@test.com' },
				password: { label: 'Password', type: 'password', placeholder: '123456' },
			},
			async authorize(credentials) {
				try {
					const { email, password } = await signInSchema.parseAsync(credentials)
					const user = await prisma.user.findUnique({
						where: { email },
						select: {
							id: true,
							name: true,
							email: true,
							password: true,
							isActive: true,
							department: true,
							location: true,
							jobTitle: true,
							validFrom: true,
							validUntil: true,
							mfaEnabled: true,
							loginCount: true,
							failedLogins: true,
							lastLoginAt: true,
							createdAt: true,
							updatedAt: true,
						},
					})

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

					return {
						id: user.id,
						email: user.email!,
						name: user.name,
						image: null,
						isActive: user.isActive,
						department: user.department,
						location: user.location,
						jobTitle: user.jobTitle,
						validFrom: user.validFrom,
						validUntil: user.validUntil,
						mfaEnabled: user.mfaEnabled,
						loginCount: user.loginCount,
						failedLogins: user.failedLogins,
						lastLogin: user.lastLoginAt,
						createdAt: user.createdAt,
						updatedAt: user.updatedAt,
					}
				} catch (error) {
					console.error('❌ Erro no authorize:', error)
					return null
				}
			},
		}),
	],

	callbacks: {
		async jwt({ token, user, account }) {
			if (user) {
				if (account?.provider !== 'credentials') {
					const dbUser = await prisma.user.findUnique({ where: { email: user.email! }, select: { id: true, name: true, email: true, isActive: true, department: true, location: true, jobTitle: true, validFrom: true, validUntil: true, mfaEnabled: true, loginCount: true, lastLoginAt: true } })

					if (dbUser) {
						token.id = dbUser.id
						token.email = dbUser.email ?? ''
						token.name = dbUser.name
						token.isActive = dbUser.isActive
						token.department = dbUser.department
						token.location = dbUser.location
						token.jobTitle = dbUser.jobTitle
						token.validFrom = dbUser.validFrom
						token.validUntil = dbUser.validUntil
						token.mfaEnabled = dbUser.mfaEnabled
						token.loginCount = dbUser.loginCount
						token.lastLoginAt = dbUser.lastLoginAt
					} else {
						const newUser = await prisma.user.create({ data: { name: user.name, email: user.email!, image: user.image, isActive: true, department: 'general', location: 'remote', loginCount: 1, lastLoginAt: new Date() }, select: { id: true, name: true, email: true, isActive: true, department: true, location: true, jobTitle: true, mfaEnabled: true, loginCount: true, lastLoginAt: true } })

						token.id = newUser.id
						token.isActive = newUser.isActive
						token.department = newUser.department
						token.location = newUser.location
						token.jobTitle = newUser.jobTitle
						token.mfaEnabled = newUser.mfaEnabled
						token.loginCount = newUser.loginCount
						token.lastLoginAt = newUser.lastLoginAt
					}
				} else {
					token.id = user.id
					token.isActive = user.isActive
					token.department = user.department
					token.location = user.location
					token.jobTitle = user.jobTitle
					token.validFrom = user.validFrom
					token.validUntil = user.validUntil
					token.mfaEnabled = user.mfaEnabled
					token.loginCount = user.loginCount
					token.lastLogin = user.lastLogin
				}
			}
			return token
		},

		async session({ session, token }) {
			// Segurança: use optional chaining para evitar TypeError quando token for undefined
			if (token?.id) {
				const user = await prisma.user.findUnique({ where: { id: token.id as string }, select: { isActive: true } })
				if (!user?.isActive) {
					// Não lançar erro aqui em produção; marcar flag para UI
					;(session as any).error = 'AccountDeactivated'
				}
			}

			if (session?.user && token?.id) {
				session.user.id = token.id as string
				session.user.isActive = Boolean(token.isActive)
				session.user.department = token.department as string
				session.user.location = token.location as string
				session.user.jobTitle = token.jobTitle as string
				session.user.validFrom = token.validFrom as Date
				session.user.validUntil = token.validUntil as Date
				session.user.mfaEnabled = Boolean(token.mfaEnabled)
				session.user.loginCount = Number(token.loginCount)
				session.user.lastLogin = token.lastLogin as Date
			}

			return session
		},

		async signIn({ user, account, profile }) {
			return true
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
		async signIn({ user, account, profile, isNewUser }) {
			console.log('🔐 SignIn event:', { userId: user.id, email: user.email, provider: account?.provider, isNewUser })
		},
		async signOut({ session, token }: { session?: any; token?: any }) {
			console.log('🚪 SignOut event:', { userId: session?.user?.id || token?.sub, email: session?.user?.email || token?.email })
		},
		async createUser({ user }) {
			console.log('👤 CreateUser event:', { userId: user.id, email: user.email })
			// Ao criar usuário via provider (ou createUser), garantir policies ABAC
			try {
				if (user?.email) {
					// Adiciona políticas idempotentes via addABACPolicy
					await addABACPolicy(user.email, 'session:read', 'read', 'allow')
					await addABACPolicy(user.email, 'usuario:areacliente', 'read', 'allow')
					await addABACPolicy(user.email, 'usuario:areacliente', 'write', 'allow')
					console.log('[auth] ABAC policies created for new user', user.email)
				} else {
					console.warn('[auth] createUser: user has no email; skipping ABAC policy creation', user)
				}
			} catch (err) {
				console.error('Failed to add ABAC policies for new user:', err)
			}
		},
		async linkAccount({ user, account, profile }) {
			console.log('🔗 LinkAccount event:', { userId: user.id, provider: account.provider })
		},
		async session({ session: _session, token: _token }) {},
	},
})

// Compatibilidade: exportar helper `auth()` que retorna a sessão no servidor.
// Muitas rotas do projeto chamam `await auth()` sem parâmetros.
async function _compatAuth() {
	try {
		// Import dinamicamente para evitar bundling no cliente
		const mod = await import('next-auth')
		if (mod && typeof (mod as any).getServerSession === 'function') {
			// getServerSession pode funcionar no ambiente server do Next.js
			// Nota: em alguns casos pode exigir req/res; aqui usamos a versão default
			return await (mod as any).getServerSession()
		}
	} catch (error) {
		console.warn('auth() helper failed to get server session:', error)
	}
	return null
}

// Export alias for backward compatibility with many files importing { auth }
export { _compatAuth as auth }
