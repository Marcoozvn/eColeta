import knex from '../database/connection'
import { Request, Response } from 'express'

class PointsController {
  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, whatsapp, latitude, longitude, city, uf, items } = req.body

    //Conceito de transactions do knex
    const trx = await knex.transaction()

    /* 
      Poderia ser knex('points').insert(...), mas o melhor para esse caso é usar transactions. Pois se acontecer um erro na inserção 
      dos 'point_items', eu quero que os 'points' também não sejam inseridos
    */
    const point = { image: req.file.filename, name, email, whatsapp, latitude, longitude, city, uf }
    const [id] = await trx('points').insert(point)

    const pointItems = items.split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
      return { item_id, point_id: id }
    })
    
    await trx('point_items').insert(pointItems)
    await trx.commit()

    return res.json({ id, ...point })
  }

  async index(req: Request, res: Response): Promise<Response> {
    const { city, uf, items } = req.query

    const parsedItems = String(items).split(',').map(item => Number(item.trim()))

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

    const serializedPoints = points.map(point => ({
      ...point,
      image: `http://192.168.1.16:3333/uploads/${point.image}` 
    }))

    return res.json(serializedPoints)
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const point = await knex('points').where('id', id).first()

    if (!point) {
      return res.status(400).json({ message: 'Point not found.' })
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    const serializedPoint = {
      ...point,
      image: `http://192.168.1.16:3333/uploads/${point.image}`
    }  

    return res.json({ ...serializedPoint, items })
  }
}

export default new PointsController()