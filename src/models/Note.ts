import mongoose from 'mongoose'
import { type Note } from '../types'

const noteShema = new mongoose.Schema<Note>({
  idUser: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    maxlength: 200
  },
  important: {
    type: Boolean,
    required: true
  },
  completed: {
    type: Boolean,
    required: true
  },
  date: {
    type: String,
    required: true
  }
})

noteShema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

/**
 * Use like a repository
 */
export default mongoose.model<Note>('Note', noteShema)
