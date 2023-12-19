import { json, type DataFunctionArgs } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { requireUserId } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariantResponse } from '@epic-web/invariant'
import { NoteEditor, action } from './__note-editor.tsx'
import { r } from '#app/entry.client.tsx'
import { useSubscribe } from '@rocicorp/reflect/react'
import { getNote } from '#app/mutators.ts'
import { useEffect, useState } from 'react'

export { action }

export default function NoteEdit() {
	const { noteId } = useParams()
	const [data, setData] = useState({ note: {} })
	useEffect(() => {
		r.subscribe(
			tx => getNote(tx, noteId as string),
			value => {
				if (value) setData({ note: value })
			},
		)
	}, [noteId])
	return <NoteEditor note={data.note} />
}

export function ErrorBoundary() {
	return (
		<GeneralErrorBoundary
			statusHandlers={{
				404: ({ params }) => (
					<p>No note with the id "{params.noteId}" exists</p>
				),
			}}
		/>
	)
}
