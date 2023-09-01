import { config } from 'dotenv'
import app from './server'
import { LogError, LogSucces } from './utils/logger'

config()
const PORT = process.env.PORT || 3000
export const serverListener = app.listen(PORT, () => {
  LogSucces(`Server ready on http://localhost:${PORT}/api`)
})

// * CONTROL SERVER ERROR
serverListener.on('error', error => {
  LogError(`SERVER ERROR: ${error.message}`)
})
