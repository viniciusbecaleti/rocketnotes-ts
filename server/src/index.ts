import 'express-async-errors'
import express, { NextFunction, Request, Response } from 'express'
import { routes } from './routes'
import { AppError } from './utils/AppError'

const app = express()

app.use(express.json())
app.use(routes)

/* eslint-disable-next-line */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  console.log(error)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

app.listen(3333, () => {
  console.log('Server running on port 3333')
})
