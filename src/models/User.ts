import mongoose from 'mongoose'
import { type UserInDB } from '../types'

const userSchema = new mongoose.Schema<UserInDB>({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  notes: {
    type: [],
    required: true
  }
})

userSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

/**
 * Use like a repository
 */
export default mongoose.model<UserInDB>('User', userSchema)
