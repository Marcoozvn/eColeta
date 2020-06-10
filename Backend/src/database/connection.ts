import knex from 'knex'
import path from 'path'
import * as knexfile from '../../knexfile'

interface Configuration {
  test: object
  development: object
}

const config = knexfile as Configuration

const connection = knex(process.env.NODE_ENV === 'test' ? config.test : config.development)

export default connection