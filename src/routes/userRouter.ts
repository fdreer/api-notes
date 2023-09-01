import { Router } from 'express'
import userController from '../controllers/UserController'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import jwtAuthFilter from '../security/JwtAuthFilter'
import { errorHandlerApp } from '../error/noteErrorHandler'

const userRouter = Router()

userRouter
  .route('/')
  .get(
    catchAsyncErrors(jwtAuthFilter.doFilterInternal),
    catchAsyncErrors(userController.getUserById)
  ) // ❗❗❗❗

userRouter
  .route('/all')
  .get(
    catchAsyncErrors(jwtAuthFilter.doFilterInternal),
    catchAsyncErrors(userController.getAllUsers)
  ) // ✅

userRouter
  .route('/')
  .put(
    catchAsyncErrors(jwtAuthFilter.doFilterInternal),
    catchAsyncErrors(userController.updateUserById)
  ) // ✅

userRouter
  .route('/notes')
  .get(
    catchAsyncErrors(jwtAuthFilter.doFilterInternal),
    catchAsyncErrors(userController.getNotesFromUser)
  ) // ✅

userRouter.use(errorHandlerApp)

export default userRouter
