import initConnectionToDB from '../config/mongo'
import express from 'express'
import dotenv from 'dotenv'
import { LogError, LogSucces, LogWarning } from './logger'
import mongoose from 'mongoose'
import noteRepository from '../models/Note'
import userRepository from '../models/User'

dotenv.config()

const deleteDb = async () => {
  // Debemos iniciar en ambiente dev
  const app = express()
  initConnectionToDB()

  const PORT = process.env.PORT ?? 3000
  const serverListener = app.listen(PORT, () => {
    LogSucces(`Server ready on localhost:${PORT}/api`)
  })

  serverListener.on('error', error => {
    LogError(`SERVER ERROR: ${error.message}`)
  })

  await noteRepository.deleteMany({})
  await userRepository.deleteMany({})

  const verificateDelete = {
    notes: await noteRepository.find({}),
    users: await userRepository.find({}),
  }

  if (verificateDelete.notes.length > 0) {
    LogWarning('No se han borrado las notas')
  } else {
    LogSucces('Se han borrado las notas')
  }

  if (verificateDelete.users.length > 0) {
    LogWarning('No se han borrado los usuarios')
  } else {
    LogSucces('Se han borrado los usuarios')
  }

  await mongoose.connection.close()
  serverListener.close()
}
deleteDb()
