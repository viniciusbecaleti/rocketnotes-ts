import { Request, Response } from 'express'
import { z } from 'zod'
import { AppError } from '../utils/AppError'
import { knex } from '../database'

export class NotesController {
  async create(req: Request, res: Response) {
    const { user } = req

    const createNoteBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      tags: z.string().array(),
      links: z.string().array(),
    })

    const body = createNoteBodySchema.safeParse(req.body)

    if (body.success === false) {
      throw new AppError('Invalid body', 409)
    }

    const { title, description, tags, links } = body.data

    const newNote = {
      title,
      description,
      user_id: user.id,
    }

    await knex.transaction(async (trx) => {
      const [{ id: insertedNoteId }] = await trx('notes')
        .insert(newNote)
        .returning('id')

      const tagList = tags.map((tag) => {
        return {
          name: tag,
          note_id: insertedNoteId,
        }
      })

      const linkList = links.map((link) => {
        return {
          url: link,
          note_id: insertedNoteId,
        }
      })

      await trx('tags').insert(tagList)
      await trx('links').insert(linkList)
    })

    return res.sendStatus(201)
  }

  async show(req: Request, res: Response) {
    const { user } = req

    const getNoteParamsSchema = z.object({
      nodeId: z.string().uuid(),
    })

    const params = getNoteParamsSchema.safeParse(req.params)

    if (params.success === false) {
      throw new AppError('Invalid params', 409)
    }

    const { nodeId } = params.data

    let note
    let tags
    let links

    await knex.transaction(async (trx) => {
      note = await trx('notes')
        .where({
          id: nodeId,
          user_id: user.id,
        })
        .first()

      if (!note) {
        throw new AppError('Note not found', 404)
      }

      tags = await trx('tags').where({
        note_id: nodeId,
      })

      links = await trx('links').where({
        note_id: nodeId,
      })
    })

    return res.json({
      note,
      tags,
      links,
    })
  }

  async delete(req: Request, res: Response) {
    const { user } = req

    const getNoteParamsSchema = z.object({
      nodeId: z.string().uuid(),
    })

    const params = getNoteParamsSchema.safeParse(req.params)

    if (params.success === false) {
      throw new AppError('Invalid params', 409)
    }

    const { nodeId } = params.data

    await knex('notes')
      .where({
        id: nodeId,
        user_id: user.id,
      })
      .delete()

    return res.sendStatus(200)
  }

  async index(req: Request, res: Response) {
    const { user } = req

    const getNoteQuerySchema = z.object({
      q: z.string().default(''),
    })

    const query = getNoteQuerySchema.safeParse(req.query)

    if (query.success === false) {
      throw new AppError('Invalid query', 409)
    }

    const { q } = query.data

    const notes = await knex('notes')
      .where({
        user_id: user.id,
      })
      .whereLike('title', `%${q}%`)
      .orderBy('created_at')

    return res.json({
      notes,
    })
  }
}
