import { config } from 'dotenv'
import {
  type Note,
  type UserInDB,
  type UserPagination,
  type UserResponseDTO,
  type UserResponseDTONotes,
  type UserToUpdate
} from '../types'
import { ErrorHandler } from '../error/errors'
import { HTTP_STATUS_CODE } from '../constants'
import userRepository from '../models/User'
import noteRepository from '../models/Note'

config()

interface IUserService {
  getNotesFromUser: (id: string, page: number, limit: number) => Promise<Note[]>
  getAllData: (id: string) => Promise<UserResponseDTONotes>
  findAllUsers: (page: number, limit: number) => Promise<UserPagination>
  findUserById: (id: string | undefined) => Promise<UserResponseDTO>
  findByUsername: (username: string) => Promise<UserInDB>
  updateUser: (
    dataToUpdate: UserToUpdate,
    id: string
  ) => Promise<UserResponseDTO>
  exists: (username: string) => Promise<boolean>
}

class UserService implements IUserService {
  async getNotesFromUser (id: string, _page = 1, _limit = 10): Promise<Note[]> {
    const userFounded = await this.findUserById(id)
    const { notes } = userFounded

    const userNotes = await noteRepository.find(
      { _id: { $in: notes } },
      { idUser: 0 }
    )
    return userNotes
  }

  async getAllData (id: string): Promise<UserResponseDTONotes> {
    const userFounded = await this.findUserById(id)
    const { username, notes } = userFounded

    const userNotes: Note[] = await noteRepository.find(
      { _id: { $in: notes } },
      { idUser: 0 }
    )

    const userToReturn: UserResponseDTONotes = {
      id: userFounded.id,
      username,
      notes: userNotes
    }

    return userToReturn
  }

  async findAllUsers (page = 1, limit = 10): Promise<UserPagination> {
    const users: UserResponseDTO[] = await userRepository
      .find({}, { password: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      // .select('id name email age')
      .exec()

    const countDocs = await userRepository.countDocuments()

    const response: UserPagination = {
      users,
      totalPages: Math.ceil(countDocs / limit),
      currentPage: page
    }

    return response
  }

  async findUserById (id: string | undefined): Promise<UserResponseDTO> {
    if (!id) {
      throw new ErrorHandler(
        'User id is required',
        HTTP_STATUS_CODE.BAD_REQUEST
      )
    }

    const user: UserResponseDTO | null = await userRepository.findById(id, {
      password: 0
    })

    if (user == null) {
      throw new ErrorHandler(
        `User with id ${id} not found`,
        HTTP_STATUS_CODE.NOT_FOUND
      )
    }

    return user
  }

  async findByUsername (username: string): Promise<UserInDB> {
    const user = await userRepository.findOne({ username })

    if (user == null) {
      throw new ErrorHandler(
        `Username ${username} not found`,
        HTTP_STATUS_CODE.NOT_FOUND
      )
    }

    return user
  }

  async updateUser (
    dataToUpdate: UserToUpdate,
    id: string
  ): Promise<UserResponseDTO> {
    const userUpdated: UserResponseDTO = await userRepository
      .findByIdAndUpdate(
        id,
        dataToUpdate,
        // set the new option to true to return the document after update was applied.
        { new: true }
      )
      .select('-password')

    if (!userUpdated) {
      throw new ErrorHandler(
        `User with id ${id} not found`,
        HTTP_STATUS_CODE.NOT_FOUND
      )
    }

    return userUpdated
  }

  async exists (username: string): Promise<boolean> {
    const user = await userRepository.findOne({ username })
    if (user === null) {
      return false
    }
    return true
  }
}

export default Object.freeze(new UserService())
