import { verify } from 'jsonwebtoken'
import { AppError } from '../utils/AppError'
import { NextFunction, Request, Response } from 'express'
import { env } from '../env'

interface CustomDecoded {
  data: {
    id: string
    name: string
    email: string
  }
  iat: number
  exp: number
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { authorization } = req.headers

  if (!authorization) {
    throw new AppError('Empty authorization header', 401)
  }

  const token = authorization.split(' ')[1]

  if (!token) {
    throw new AppError('Invalid JWT token', 401)
  }

  const decoded = verify(token, env.JWT_SECRET_TOKEN) as CustomDecoded

  req.user = decoded.data

  return next()
}
