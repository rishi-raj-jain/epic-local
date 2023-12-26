import { type Note } from '@prisma/client'
import { MyAuthData } from '#reflect-server/index.js'
import { WriteTransaction, generate } from '@rocicorp/rails'

export const {
	set: putNote,
	get: getNote,
	list: listNotes,
	update: updateNote,
	delete: deleteNoteInternal,
} = generate<Note>('notes')

export const mutators = {
	putNote,
	getNote,
	listNotes,
	updateNote,
	deleteNote: async (tx: WriteTransaction, noteId: string) => {
		const auth = tx.auth as MyAuthData
		// Check if user is in client mode
		if (typeof window !== 'undefined') {
			return await deleteNoteInternal(tx, noteId)
		}
		// if on server, look at write
		if (auth.access === 'write') {
			return await deleteNoteInternal(tx, noteId)
		}
	},
}
