import { Request, Response } from 'express'
import { z } from 'zod'
import { AppError } from '../utils/AppError'
import { knex } from '../database'
import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { env } from '../env'

export class SessionsController {
  async create(req: Request, res: Response) {
    const createSessionBodySchema = z.object({
      email: z.string().email(),
      password: z.string(),
    })

    const body = createSessionBodySchema.safeParse(req.body)

    if (body.success === false) {
      throw new AppError('Invalid body', 409)
    }

    const { email, password } = body.data

    const user = await knex('users')
      .where({
        email,
      })
      .first()

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const matchedPassword = await compare(password, user.password)

    if (!matchedPassword) {
      throw new AppError('Invalid password', 401)
    }

    const token = sign(
      {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      env.JWT_SECRET_TOKEN,
      {
        expiresIn: '1d',
      },
    )

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    })
  }
}
