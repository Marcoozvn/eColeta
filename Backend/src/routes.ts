import express from 'express'
import multer from 'multer'

import ItemsController from './controllers/ItemsController'
import PointsController from './controllers/PointsController'
import PointValidator from './validators/PointValidator'
import multerConfig from './config/multer'

const routes = express.Router()
const upload = multer(multerConfig)

routes.get('/items', ItemsController.index)

routes.get('/points', PointsController.index)
routes.post('/points', upload.single('image'), PointValidator.validate, PointsController.create)
routes.get('/points/:id', PointsController.show)

export default routes