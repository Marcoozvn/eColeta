import { Joi, celebrate } from 'celebrate'
import { Request, Response } from 'express'

class PointValidator {
  validate(req: Request, res: Response, next: any) {
    celebrate({
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().regex(new RegExp('([0-9]+,)*[0-9]+$', 'm')).required()
      })
    }, { abortEarly: false })
    next()
  }
}

export default new PointValidator()