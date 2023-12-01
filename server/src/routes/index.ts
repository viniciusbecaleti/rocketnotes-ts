import { Router } from 'express'
import { usersRoutes } from './users.routes'
import { notesRoutes } from './notes.routes'
import { sessionsRoutes } from './sessions.routes'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

export const routes = Router()

routes.use('/sessions', sessionsRoutes)
routes.use('/users', usersRoutes)
routes.use('/notes', ensureAuthenticated, notesRoutes)
