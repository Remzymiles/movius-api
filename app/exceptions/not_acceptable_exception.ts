import { Exception } from '@adonisjs/core/exceptions'

export default class NotAcceptableException extends Exception {
  static status = 406
  static code = 'E_NOT_ACCEPTABLE'
}
