import knex from '../database/connection'
import { Request, Response } from 'express'

class ItemsController {
  async index(req: Request, res: Response): Promise<Response> {
    const items = await knex('items').select('*')

    const serializedItems = items.map( item => ({ ...item, image_url: `http://192.168.1.16:3333/uploads/${item.image}`}))

    return res.json(serializedItems)  
  }
}

export default new ItemsController()