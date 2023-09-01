import { config } from 'dotenv'
import express from 'express'
import {
  corsConfig,
  httpTimeOut,
  limitPayloadSize,
  requestLimiter,
} from '../security/securityServer'
import connectionDB from '../config/mongo'
import rootRouter from '../routes'

config()
export const app = express()

connectionDB()

app.use(corsConfig)
app.use(requestLimiter)
app.use(httpTimeOut)
app.use(express.urlencoded({ extended: true, limit: '50mb' })) // ❓❓❓
app.use(express.json())
app.use(limitPayloadSize)

// Se utiliza el index de todas las rutas
app.use('/api', rootRouter)

app.use(express.static('public'))

app.get('/', (_req, res) => {
  return res.send('Hello World!')
})

export default app
