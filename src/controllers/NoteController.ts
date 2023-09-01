import noteService from '../services/NoteService'
import { type NextFunction, type Request, type Response } from 'express'
import { HTTP_STATUS_CODE } from '../constants'
import { type NewNoteToCreate, type Note } from '../types'
import {
  validateNoteCreate,
  validateNoteUpdate
} from '../middlewares/validateNote'

interface INoteController {
  createNote: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response>
  getNotes: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response>
  deleteNote: (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => Promise<Response>
  updateNote: (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => Promise<Response>
}

class NoteController implements INoteController {
  async updateNote (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const { id } = req.query

    const body: Note = req.body
    const noteValidated = validateNoteUpdate(body)

    if (!noteValidated.success) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ error: noteValidated.error.format() })
    }

    const noteUpdated = await noteService.update(body, id as string)
    return res.status(HTTP_STATUS_CODE.OK).json(noteUpdated)
  }

  async createNote (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const body: NewNoteToCreate = req.body

    const resultValidateNote = validateNoteCreate(req.body)

    if (!resultValidateNote.success) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ error: resultValidateNote.error.format() })
    }

    const newNote = await noteService.createNote(resultValidateNote.data)
    return res.status(HTTP_STATUS_CODE.OK).json(newNote)
  }

  async getNotes (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const { id } = req.query

    const response = id
      ? await noteService.findNoteById(id as string)
      : await noteService.findAllNotes()

    return res.status(HTTP_STATUS_CODE.OK).json(response)
  }

  async deleteNote (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const { id } = req.query
    const note = await noteService.deleteNoteById(id as string)

    return res.sendStatus(HTTP_STATUS_CODE.NO_CONTENT)
  }
}
export default Object.freeze(new NoteController())
