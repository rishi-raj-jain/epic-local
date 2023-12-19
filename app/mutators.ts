import { generate } from "@rocicorp/rails";

type Notes = {
  id: string;
  title: string;
  content: string;
  images?: {
    id?: string | undefined;
    altText?: string | undefined;
  }[];
}

export const {
  set: putNote,
  get: getNote,
  list: listNotes,
  update: updateNote,
  delete: deleteNote,
} = generate<Notes>("notes");

export const mutators = {
  putNote,
  getNote,
  listNotes,
  updateNote,
  deleteNote,
}
