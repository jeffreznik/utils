import axios from 'axios'
import storage from './localStorage'
import { GeneralError, HttpError } from '@jeffreznik/error'

function prepareConfig(config) {
  // Prevent setting authorization header if request is cross-origin (HACK: probably a better way to detect this)
  if (config.url.indexOf('http://') === 0 || config.url.indexOf('https://') === 0) {
    return config
  }
  if (storage.getItem('token')) {
    config.headers = Object.assign(config.headers || {}, { 'Authorization': 'Bearer ' + storage.getItem('token') })
  }
  if (typeof window === 'undefined') {
    // if on server, add the scheme, host and port for application to request to itself (url is relative at this point)
    config.url = (process.env.SECURE ? 'https' : 'http') + '://' + process.env.API_HOST + ':' + process.env.PORT + config.url
  }
  return config
}

export default class HttpClient {
  static async request(config) {
    config = prepareConfig(config)
    try {
      return await axios(config)
    } catch (error) {
      if (typeof error.data === 'undefined') {
        // if no error.data the request never actually happened
        throw new GeneralError(`failed setting up http request`, error)
      } else {
        throw new HttpError(`${error.status} ${error.statusText} at ${config.url}`, error)
      }
    }
  }
  static get(url, config = {}) {
    config.method = 'GET'
    config.url = url
    return this.request(config)
  }
  static post(url, data, config = {}) {
    config.method = 'POST'
    config.url = url
    config.data = data
    return this.request(config)
  }
  static patch(url, data, config = {}) {
    config.method = 'PATCH'
    config.url = url
    config.data = data
    return this.request(config)
  }
  static put(url, data, config = {}) {
    config.method = 'PUT'
    config.url = url
    config.data = data
    return this.request(config)
  }
  static delete(url, config = {}) {
    config.method = 'DELETE'
    config.url = url
    return this.request(config)
  }
}
