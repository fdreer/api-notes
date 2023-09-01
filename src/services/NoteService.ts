import { HTTP_STATUS_CODE } from '../constants'
import { ErrorHandler } from '../error/errors'
import { type NewNoteToCreate, type Note, type NoteResponse, type NoteToUpdate } from '../types'
import noteRepository from '../models/Note'
import userService from './UserService'

interface INoteService {
  createNote: (newNoteToCreate: NewNoteToCreate) => Promise<NoteResponse>
  update: (noteToUpdate: NoteToUpdate, id: string) => Promise<Note>
  //   updateNote(note: Note): Promise<Note>
  findAllNotes: () => Promise<Note[]>
  findNoteById: (id: string) => Promise<Note>
  deleteNoteById: (id: string) => Promise<void>
}

class NoteService implements INoteService {
  async update (dataToUpdate: NoteToUpdate, id: string): Promise<Note> {
    const noteUpdated: Note | null = await noteRepository.findByIdAndUpdate(
      id,
      dataToUpdate,
      // set the new option to true to return the document after update was applied.
      { new: true }
    )

    if (noteUpdated == null) {
      throw new ErrorHandler(
        `Note with id ${id} not found`,
        HTTP_STATUS_CODE.NOT_FOUND
      )
    }

    return noteUpdated
  }

  async createNote (newNoteToCreate: NewNoteToCreate): Promise<NoteResponse> {
    const newNote = new noteRepository(newNoteToCreate)
    const noteSaved: Note = await newNote.save()

    const { id, idUser, completed, content, date, important, title } = noteSaved
    const userToUpdate = await userService.findUserById(idUser)

    userToUpdate.notes.push(id)
    await userService.updateUser({ notes: userToUpdate.notes }, idUser)
    return { id, completed, content, date, important, title }
  }

  async findAllNotes (): Promise<Note[]> {
    const notes = await noteRepository.find({})
    return notes
  }

  async findNoteById (id: string): Promise<Note> {
    const note = await noteRepository.findById(id)
    if (note == null) {
      throw new ErrorHandler(
        `Note with id ${id} not found`,
        HTTP_STATUS_CODE.NOT_FOUND
      )
    }
    return note
  }

  async deleteNoteById (id: string): Promise<void> {
    const noteDeleted: Note | null = await noteRepository.findByIdAndDelete(id)

    if (noteDeleted == null) {
      throw new ErrorHandler(
        `Note with id ${id} not found`,
        HTTP_STATUS_CODE.NOT_FOUND
      )
    }

    const { idUser } = noteDeleted
    const userToUpdate = await userService.findUserById(idUser)
    const newNotes = userToUpdate.notes.filter(note => note !== id)
    await userService.updateUser({ notes: newNotes }, idUser)
  }
}
export default Object.freeze(new NoteService())
