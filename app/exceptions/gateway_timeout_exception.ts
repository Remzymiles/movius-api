import { Exception } from '@adonisjs/core/exceptions'

export default class GatewayTimeoutException extends Exception {
  static status = 504
  static code = 'E_GATEWAY_TIMEOUT'
}
