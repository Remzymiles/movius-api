import { Exception } from '@adonisjs/core/exceptions'

export default class MethodNotAllowedException extends Exception {
  static status = 405
  static code = 'E_METHOD_NOT_ALLOWED'
}
