import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { prisma } from '#app/utils/db.server.ts'
import { authSessionStorage } from '#app/utils/session.server'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
	const cookieHeader = request.headers.get('cookie')
	// If cookie exists
	if (!cookieHeader) return new Response(null, { status: 400 })
	const cookies = cookie.parse(cookieHeader)
	// If cookie has the session value
	if (!cookies['en_session']) return new Response(null, { status: 400 })
	const authSession = await authSessionStorage.getSession(cookieHeader)
	const sessionId = authSession.get('sessionId')
	const prismaSession = await prisma.session.findUnique({
		select: { userId: true },
		where: { id: sessionId },
	})
	// If there's a session pertaining to the cookie header
	if (!prismaSession) return new Response(null, { status: 404 })
	const { userId } = prismaSession
	// If there's a userId and sessionId attached to the session
	var token = jwt.sign(
		{ sessionId, userId },
		process.env.SESSION_SECRET.split(',')[0],
	)
	return new Response(JSON.stringify({ token, userId }), {
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

export async function action({ request }: ActionFunctionArgs) {
	const authURL = new URL(request.url, 'https://a.b')
	const authCookie = authURL.searchParams.get('auth')
	// If there's a token in the request
	if (!authCookie) return new Response(null, { status: 400 })
	const verifiedSession = jwt.verify(
		authCookie,
		process.env.SESSION_SECRET.split(',')[0],
	)
	// If the JWT is decoded correctly
	if (!verifiedSession) return new Response(null, { status: 400 })
	const prismaSession = await prisma.session.findUnique({
		select: { userId: true },
		where: { id: verifiedSession['sessionId'] },
	})
	// If there's a session pertaining to the cookie header
	if (!prismaSession) return new Response(null, { status: 404 })
	const { userId } = prismaSession
	if (userId === verifiedSession['userId']) {
		return new Response(JSON.stringify({ userID: userId, access: 'write' }), {
			headers: {
				'Content-Type': 'application/json',
			},
		})
	}
	return new Response(null, { status: 404 })
}
