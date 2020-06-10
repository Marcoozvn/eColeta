import request from 'supertest'
import connection from '../src/database/connection'
import path from 'path'
import app from '../src/app'
import fs from 'fs'

describe('Point', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
    await connection.seed.run()
  })

  // Após os testes, apaga as imagens criadas e destrói a conexão com o banco
  afterAll(async () => {
    const images = await connection('points').select('image')
    images.forEach((image: { image: string }) => fs.unlinkSync(path.resolve(__dirname, '..', 'uploads', image.image)))
    await connection.destroy()
  })

  it('should be able to create a new Point', async () => {
    const file = path.resolve(__dirname, 'mock', 'mock_image.png')

    const response = await request(app)
      .post('/points')
      .attach('image', file)
      .field('name', 'Mercadinho 123')
      .field('email', 'contato@mercadinho.com')
      .field('whatsapp', '839999999')
      .field('latitude', 0)
      .field('longitude', 0)
      .field('city', 'Patos')
      .field('uf', 'PB')
      .field('items', '1')
      .expect(200)

    expect(response.body).toMatchObject({
      id: 1,
      name: 'Mercadinho 123',
      email: 'contato@mercadinho.com',
      whatsapp: '839999999',
      latitude: '0',
      longitude: '0',
      city: 'Patos',
      uf: 'PB'
    })

    const point_item = await connection('point_items').select('*')

    expect(point_item).toHaveLength(1)
    expect(point_item[0]).toMatchObject({
      id: 1,
      point_id: 1,
      item_id: 1
    })
  })

  it('should be able to list points with city, uf and items', async () => {
    const response = await request(app)
      .get('/points?city=Patos&uf=PB&items=1')
      .send()

    expect(response.body).toMatchObject([
     {
      id: 1,
      name: 'Mercadinho 123',
      email: 'contato@mercadinho.com',
      whatsapp: '839999999',
      latitude: 0,
      longitude: 0,
      city: 'Patos',
      uf: 'PB'
     } 
    ])
  })

  it('should be able to get one point', async () => {
    const response = await request(app)
      .get('/points/1')
      .send()

    expect(response.body).toMatchObject({
      id: 1,
      name: 'Mercadinho 123',
      email: 'contato@mercadinho.com',
      whatsapp: '839999999',
      latitude: 0,
      longitude: 0,
      city: 'Patos',
      uf: 'PB'
    })
  })


})