import express from 'express'
import notesRouter from './notesRouter'
import userRouter from './userRouter'
import authRouter from './authRouter'

/**
 * All routes of the proyect.
 */
const rootRouter = express()

rootRouter.use('/notes', notesRouter)
rootRouter.use('/users', userRouter)
rootRouter.use('/auth', authRouter)

export default rootRouter
