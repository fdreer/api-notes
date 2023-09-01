import { type Response } from 'express'
import { type ErrorResponse } from '../types'

export const responseError = (
  statusCode: number,
  message: string,
  res: Response
): Response<ErrorResponse> => {
  return res.status(statusCode).json({
    message,
    statusCode
  })
}

export class ErrorHandler extends Error {
  statusCode: number
  constructor (message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}
