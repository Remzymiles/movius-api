import { Exception } from '@adonisjs/core/exceptions'

export default class ServiceUnavailableException extends Exception {
  static status = 503
  static code = 'E_SERVICE_UNAVAILABLE'
}
