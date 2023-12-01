import { Request, Response } from 'express'
import { z } from 'zod'
import { AppError } from '../utils/AppError'
import { knex } from '../database'
import { hash } from 'bcrypt'

export class UsersController {
  async create(req: Request, res: Response) {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string(),
    })

    const body = createUserBodySchema.safeParse(req.body)

    if (body.success === false) {
      throw new AppError('Invalid body', 400)
    }

    const { name, email, password } = body.data

    const user = await knex('users')
      .where({
        email,
      })
      .first()

    if (user) {
      throw new AppError('E-mail já cadastrado', 409)
    }

    const newUser = {
      name,
      email,
      password: await hash(password, 10),
    }

    await knex('users').insert(newUser)

    return res.sendStatus(201)
  }
}
