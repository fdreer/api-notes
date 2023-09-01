import { type NextFunction, type Request, type Response } from 'express'

const catchAsyncErrors =
  // eslint-disable-next-line @typescript-eslint/ban-types
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

export default catchAsyncErrors
