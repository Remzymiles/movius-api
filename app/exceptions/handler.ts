import { IBaseError } from '#interfaces/base.interface'
import { Exception } from '@adonisjs/core/exceptions'
import { ExceptionHandler, HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import logger from '@adonisjs/core/services/logger'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * Checks if the error message contains SQL-related content
   */
  private containsSqlError(errorMessage: string): boolean {
    const sqlKeywords = ['sql', 'query', 'database', 'table', 'column', 'constraint']
    return sqlKeywords.some((keyword) => errorMessage.toLowerCase().includes(keyword))
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: Exception & { messages?: any[] }, ctx: HttpContext) {
    let errorMessage: any = error.messages?.length ? error.messages[0] : error.message

    if (typeof errorMessage === 'object' && 'message' in errorMessage) {
      errorMessage = errorMessage.message
    }

    if (error.name === 'Exception' && app.inProduction) {
      logger.error(error.message)
      errorMessage = 'A server error occurred please contact support'
    }

    const isSqlError = this.containsSqlError(errorMessage)

    if (isSqlError && app.inProduction) {
      logger.error(errorMessage)
      errorMessage = 'A server error occurred please contact support'
    }

    return ctx.response.status(error.status ?? 500).send({
      message: isSqlError ? 'Unknown error occurred' : errorMessage,
      data: Object.keys(ctx.request.all()).length > 0 ? ctx.request.all() : undefined,
      type: error.name ?? 'InternalServerError',
      statusCode: error.status ?? 500,
      path: ctx.request.url(),
      errors: error.messages ?? [],
      timestamp: new Date().toISOString(),
    } satisfies IBaseError)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
