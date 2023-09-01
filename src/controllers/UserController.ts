import userService from '../services/UserService'
import { validateUserUpdate } from '../middlewares/validateUser'
import { type NextFunction, type Request, type Response } from 'express'
import { HTTP_STATUS_CODE } from '../constants'
import { type UserToUpdate } from '../types'

interface IUserController {
  getAllUsers: (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => Promise<Response>
  getNotesFromUser: (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => Promise<Response>
  getUserById: (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => Promise<Response>
  updateUserById: (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => Promise<Response>
}

class UserController implements IUserController {
  /**
   * Return only the notes from a user
   */
  async getNotesFromUser (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)
    const { id } = req.query

    const user = await userService.getNotesFromUser(id as string, page, limit)
    return res.status(HTTP_STATUS_CODE.OK).json(user)
  }

  /**
   * Return all users with pagination
   */
  async getAllUsers (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    const user = await userService.findAllUsers(page, limit)
    return res.status(HTTP_STATUS_CODE.OK).json(user)
  }

  async getUserById (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const { id, all } = req.query

    const user =
      all === 'true'
        ? await userService.getAllData(id as string)
        : await userService.findUserById(id as string)
    return res.status(HTTP_STATUS_CODE.OK).json(user)
  }

  /**
   * Update user data by id
   */
  async updateUserById (
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> {
    const body: UserToUpdate = req.body
    const validateData = validateUserUpdate(body)

    if (!validateData.success) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json({ error: validateData.error.format() })
    }

    const { id } = req.query
    const { username, notes } = body
    const userUpdated = await userService.updateUser(
      { username, notes },
      id as string
    )

    return res.status(HTTP_STATUS_CODE.OK).json(userUpdated)
  }
}

export default Object.freeze(new UserController())
