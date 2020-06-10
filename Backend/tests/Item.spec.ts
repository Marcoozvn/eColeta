import request from 'supertest'
import app from '../src/app'
import connection from '../src/database/connection'

describe('Item', () => {
  beforeAll(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
    await connection.seed.run()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to fetch items', async () => {
    const response = await request(app)
      .get('/items')
      .send()

    expect(response.body).toMatchObject([
      {
        'id': 1,
        'image': 'lampadas.svg',
        'title': 'Lâmpadas',
        'image_url': 'http://192.168.1.16:3333/uploads/lampadas.svg'
      },
      {
        'id': 2,
        'image': 'baterias.svg',
        'title': 'Pilhas e Baterias',
        'image_url': 'http://192.168.1.16:3333/uploads/baterias.svg'
      },
      {
        'id': 3,
        'image': 'papeis-papelao.svg',
        'title': 'Papéis e Papelão',
        'image_url': 'http://192.168.1.16:3333/uploads/papeis-papelao.svg'
      },
      {
        'id': 4,
        'image': 'eletronicos.svg',
        'title': 'Resíduos Eletrônicos',
        'image_url': 'http://192.168.1.16:3333/uploads/eletronicos.svg'
      },
      {
        'id': 5,
        'image': 'organicos.svg',
        'title': 'Resíduos Orgânicos',
        'image_url': 'http://192.168.1.16:3333/uploads/organicos.svg'
      },
      {
        'id': 6,
        'image': 'oleo.svg',
        'title': 'Óleo de Cozinha',
        'image_url': 'http://192.168.1.16:3333/uploads/oleo.svg'
      }
    ])
  })
})