import { Note } from '@prisma/client'
import { generate } from '@rocicorp/rails'

export const {
	set: putNote,
	get: getNote,
	list: listNotes,
	update: updateNote,
	delete: deleteNote,
} = generate<Note>('notes')

export const mutators = {
	putNote,
	getNote,
	listNotes,
	updateNote,
	deleteNote,
}
