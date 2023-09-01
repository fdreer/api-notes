import { HTTP_STATUS_CODE } from '../constants'
import { ErrorHandler } from '../error/errors'
import userService from '../services/UserService'
import { type AuthRespose, type UserAuth, type UserRegister, type UserToSaveInDB } from '../types'
import bcrypt from 'bcrypt'
import jwtService from './JwtService'
import userRepository from '../models/User'

interface IAthService {
  registerUser: (userToRegister: UserRegister) => Promise<AuthRespose>
  loginUser: (userToAuthenticate: UserAuth) => Promise<AuthRespose>
}

class AuthService implements IAthService {
  async registerUser (userToRegister: UserRegister): Promise<AuthRespose> {
    const { username, password } = userToRegister
    const isExistingUser = await userService.exists(username)

    if (isExistingUser) {
      throw new ErrorHandler(
        `El usuario ${username} ya existe`,
        HTTP_STATUS_CODE.BAD_REQUEST
      )
    }

    const hashPassword = bcrypt.hashSync(password, 8)

    const userWithHashPassword: UserToSaveInDB = {
      username,
      password: hashPassword,
      notes: []
    }

    const { id, username: usernameSaved } = await new userRepository(
      userWithHashPassword
    ).save()

    const jwt = jwtService.generateToken(usernameSaved)
    return { id, jwt }
  }

  async loginUser (userToAuth: UserAuth): Promise<AuthRespose> {
    const { username, password } = userToAuth
    const { id, password: passwordDB } = await userService.findByUsername(
      username
    )

    const isPasswordValid = bcrypt.compareSync(password, passwordDB)

    if (!isPasswordValid) {
      throw new ErrorHandler(
        'Contraseña incorrecta',
        HTTP_STATUS_CODE.BAD_REQUEST
      )
    }

    const jwt = jwtService.generateToken(username)
    return { id, jwt }
  }
}

export default Object.freeze(new AuthService())
