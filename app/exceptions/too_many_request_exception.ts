import { Exception } from '@adonisjs/core/exceptions'

export default class TooManyRequestException extends Exception {
  static status = 429
  static code = 'E_TOO_MANY_REQUEST'
}
