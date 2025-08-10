import { Exception } from '@adonisjs/core/exceptions'

export default class RequestTimeoutException extends Exception {
  static status = 408
  static code = 'E_REQUEST_TIMEOUT'
}
