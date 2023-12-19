import { RemixBrowser } from '@remix-run/react'
import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'

if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	import('./utils/monitoring.client.tsx').then(({ init }) => init())
}

import { Reflect } from '@rocicorp/reflect/client'
import { mutators } from './mutators'

export const r = new Reflect({
	server: 'http://localhost:8080',
	roomID: 'myRoom',
	userID: 'myUser',
	mutators,
})

startTransition(() => {
	hydrateRoot(document, <RemixBrowser />)
})
