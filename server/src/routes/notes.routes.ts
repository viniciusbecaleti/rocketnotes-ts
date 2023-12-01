import { Router } from 'express'
import { NotesController } from '../controllers/NotesController'

const notesRoutes = Router()
const notesController = new NotesController()

notesRoutes.post('/', notesController.create)
notesRoutes.get('/:nodeId', notesController.show)
notesRoutes.delete('/:nodeId', notesController.delete)
notesRoutes.get('/', notesController.index)

export { notesRoutes }
