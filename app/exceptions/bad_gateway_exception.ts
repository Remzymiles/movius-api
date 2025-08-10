import { Exception } from '@adonisjs/core/exceptions'

export default class BadGatewayException extends Exception {
  static status = 502
  static code = 'E_BAD_GATEWAY'
}
