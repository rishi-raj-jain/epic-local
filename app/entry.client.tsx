import { mutators } from './mutators'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { RemixBrowser } from '@remix-run/react'
import { Reflect } from '@rocicorp/reflect/client'

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	import('./utils/monitoring.client.tsx').then(({ init }) => init())
}

export const r = new Reflect({
	mutators,
	kvStore: 'idb',
	roomID: 'myRoom',
	userID: 'myUser',
	server: 'http://localhost:8080',
})

startTransition(() => {
	hydrateRoot(document, <RemixBrowser />)
})
