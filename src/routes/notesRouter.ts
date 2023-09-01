import { Router } from 'express'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import jwtAuthFilter from '../security/JwtAuthFilter'
import noteController from '../controllers/NoteController'
import { errorHandlerApp } from '../error/noteErrorHandler'

/**
 * Endpoints a rutas especificas de notas.
 */
const notesRouter = Router()

notesRouter
  .route('/')
  .get(
    catchAsyncErrors(jwtAuthFilter.doFilterInternal),
    catchAsyncErrors(noteController.getNotes)
  )
  .post(
    catchAsyncErrors(jwtAuthFilter.doFilterInternal),
    catchAsyncErrors(noteController.createNote)
  )
  .put(
    catchAsyncErrors(jwtAuthFilter.doFilterInternal),
    catchAsyncErrors(noteController.updateNote)
  )
  .delete(
    catchAsyncErrors(jwtAuthFilter.doFilterInternal),
    catchAsyncErrors(noteController.deleteNote)
  )

notesRouter.use(errorHandlerApp)

export default notesRouter
