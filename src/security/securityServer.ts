import { rateLimit } from 'express-rate-limit'
import cors from 'cors'
import { type NextFunction, type Request, type Response } from 'express'
import { HTTP_STATUS_CODE } from '../constants'
import { ErrorHandler } from '../error/errors'

export const requestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

export const corsConfig = cors({
  // origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept']
})

export const httpTimeOut = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.setTimeout(10000) // Set request timeout to 5 seconds
  res.setTimeout(10000) // Set response timeout to 5 seconds
  next()
}

export const limitPayloadSize = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const MAX_PAYLOAD_SIZE = 1024 * 1024 // 1MB
  if (
    req.headers['content-length'] &&
    parseInt(req.headers['content-length']) > MAX_PAYLOAD_SIZE
  ) {
    throw new ErrorHandler(
      'Payload size exceeds the limit',
      HTTP_STATUS_CODE.CONTENT_TOO_LARGE
    )
  }
  next()
}
