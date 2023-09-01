import { z } from 'zod'
import { type NewNoteToCreate, type NoteToUpdate } from '../types'

export const noteSchema = z.object({
  idUser: z.string(),
  title: z
    .string({
      required_error: 'Title is required',
      invalid_type_error: 'Title must be a string'
    })
    .trim()
    .max(200, {
      message: 'Title must be less than 50 characters'
    }),
  content: z
    .string({
      required_error: 'Content is required',
      invalid_type_error: 'Content must be a string'
    })
    .trim()
    .max(500, {
      message: 'Content must be less than 200 characters'
    }),
  important: z
    .boolean({
      invalid_type_error: 'Important must be a boolean'
    })
    .optional()
    .default(false),
  completed: z
    .boolean({
      invalid_type_error: 'Completed must be a boolean'
    })
    .optional()
    .default(false),
  date: z.string().optional().default(new Date().toString())
})

export const validateNoteCreate = (noteToValidate: NewNoteToCreate) => {
  return noteSchema.safeParse(noteToValidate)
}

export const validateNoteUpdate = (noteToValidate: NoteToUpdate) => {
  return noteSchema.partial().safeParse(noteToValidate)
}
