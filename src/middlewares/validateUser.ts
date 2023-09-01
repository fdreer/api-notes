import { z } from 'zod'
import { type UserRegister, type UserToUpdate } from '../types'

const userRegisterSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters long')
    .max(50, 'Username must be less than 50 characters long'),
  password: z.string().min(5, 'Password must be at least 5 characters long')
})

export const validateUserRegister = (userToValidate: UserRegister) => {
  return userRegisterSchema.safeParse(userToValidate)
}

export const validateUserUpdate = (userToValidate: UserToUpdate) => {
  return userRegisterSchema.partial().safeParse(userToValidate)
}
