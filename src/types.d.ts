import { noteSchema } from '../middlewares/validateNote'

/**
 * Ping Response to test the api in /api/ping
 */
export interface PingPongResponse {
  message: string
}

/**
 * Model Note
 */
export interface Note {
  id: string
  idUser: string
  title: string
  content: string
  important: boolean
  completed: boolean
  date: string
}

export type NoteToUpdate = Partial<Omit<Note, 'id'>>

/**
 * Model Note to create a note
 */
export type NewNoteToCreate = Omit<Note, 'id'>

/**
 * The json that the server will response a note
 */
export type NoteResponse = Omit<Note, 'idUser'>

/**
 * The json to response a note
 */
export type NoteRequest = NewNoteToCreate

export interface UserInDB {
  id: string
  username: string
  password: string
  notes: string[]
}

export interface UserResponseDTO {
  id: string
  username: string
  notes: string[]
}

export interface UserResponseDTONotes {
  id: string
  username: string
  notes: NoteResponse[]
}

export interface UserToSaveInDB {
  username: string
  password: string | undefined
  notes: string[]
}

export type UserToUpdate = Partial<Omit<UserInDB, 'id'>>
export interface UserRegister {
  username: string
  password: string
}

export interface UserAuth {
  username: string
  password: string
}

export interface AuthRespose {
  id: string
  jwt: string
}

export interface UserPagination {
  users: UserResponseDTO[]
  totalPages: number
  currentPage: number
}

export interface ErrorResponse {
  statusCode: number
  message: string
}

// * ERRORES DE MOGODB
export interface ValidationError {
  name: 'ValidationError'
  errors: Record<string, ValidatorError | CastError>
}

export interface ValidatorError {
  name: 'ValidatorError'
  properties: {
    message: string
  }
}

export interface CastError {
  name: 'CastError'
  message?: string
  path?: string
  kind?: string
  valueType?: string
}
