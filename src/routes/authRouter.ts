import { Router } from 'express'
import catchAsyncErrors from '../middlewares/catchAsyncErrors'
import jwtAuthFilter from '../security/JwtAuthFilter'
import { errorHandlerApp } from '../error/noteErrorHandler'
import authController from '../security/AuthController'

const authRouter = Router()

authRouter.post('/register', catchAsyncErrors(authController.registerUser))
authRouter.post('/login', catchAsyncErrors(authController.loginUser))
// si verifyToken falla, el siguiente codigo no se ejecuta
authRouter.get(
  '/me',
  catchAsyncErrors(jwtAuthFilter.doFilterInternal),
  catchAsyncErrors(authController.userData)
)

authRouter.use(errorHandlerApp)

export default authRouter
