import { mutators } from '../app/mutators'
import type {
	AuthHandler,
	ReflectServerOptions,
} from '@rocicorp/reflect/server'
import type { AuthData } from '@rocicorp/reflect'

export type MyAuthData = AuthData & { access: 'read' | 'write' }

const authHandler: AuthHandler = async (auth: string, _: any, __: any) => {
	if (auth) {
		const fetchCall = await fetch(
			`http://localhost:3000/reflect?auth=${auth}`,
			{
				method: 'POST',
			},
		)
		const fetchResponse = await fetchCall.json()
		return fetchResponse as MyAuthData
	}
	return null
}

export default function makeOptions(): ReflectServerOptions<any> {
	return {
		mutators,
		authHandler,
		logLevel: 'debug',
	}
}
