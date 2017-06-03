import mysql2 from 'mysql2/promise'
import jsonfile from 'jsonfile'
import { GeneralError } from '@jeffreznik/error'

let instance = null

class MySql {

  constructor(config) {
    if (instance !== null) {
      throw new GeneralError('mysql has already been initialized, call mysql.getConnection()')
    }

    const connectionConfig = Object.assign({
      host: 'localhost',
      port: 3306,
      queryFormat: function(query, values) {
        if (!values) return query
        return query.replace(/\:(\w+)/g, (txt, key) => {
          if (values.hasOwnProperty(key)) {
            return this.escape(values[key])
          }
          return txt
        })
      },
    }, config)

    this.connectionPromise = mysql2.createConnection(connectionConfig)

    instance = this
  }

  static init(pathToConfigOrConfigObject) {
    let config = {}
    if (typeof pathToConfigOrConfigObject === 'string') {
      try {
        config = jsonfile.readFileSync(pathToConfigOrConfigObject)
      } catch (error) {
        throw new GeneralError('unable to read mysql connection configuration file', error)
      }
    } else {
      config = pathToConfigOrConfigObject
    }
    return new MySql(config)
  }

  static async getConnection() {
    if (instance === null) {
      throw new GeneralError('unable to get MySql connection: need to call mysql.init() first')
    }
    try {
      return await instance.connectionPromise
    } catch (error) {
      throw new GeneralError('unable to connect to MySql', error)
    }
  }
}

export default MySql
