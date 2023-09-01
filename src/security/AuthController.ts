import userService from '../services/UserService'
import authService from './AuthService'
import { ErrorHandler } from '../error/errors'
import { validateUserRegister } from '../middlewares/validateUser'
import { HTTP_STATUS_CODE } from '../constants'
import { type NextFunction, type Request, type Response } from 'express'
import { type UserAuth, type UserRegister } from '../types'

interface IAuthController {
  registerUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response>
  loginUser: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response>
  userData: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response>
}

class AuthController implements IAuthController {
  async registerUser (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const dataToValidate: UserRegister = req.body
    const resultValidateUser = validateUserRegister(dataToValidate)

    if (!resultValidateUser.success) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ error: resultValidateUser.error.format() })
    }

    const userRegistered = await authService.registerUser(dataToValidate)
    return res.status(HTTP_STATUS_CODE.CREATED).json(userRegistered)
  }

  async loginUser (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const userToAuth: UserAuth = req.body
    const { username, password } = userToAuth

    if (!username || !password) {
      throw new ErrorHandler(
        'Email and password are required',
        HTTP_STATUS_CODE.BAD_REQUEST
      )
    }

    const userAutheticated = await authService.loginUser(userToAuth)
    return res.status(HTTP_STATUS_CODE.OK).json(userAutheticated)
  }

  async userData (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const id: string | undefined = req.query.id?.toString()

    const userData = await userService.findUserById(id)
    return res.status(HTTP_STATUS_CODE.OK)
  }
}

export default Object.freeze(new AuthController())
