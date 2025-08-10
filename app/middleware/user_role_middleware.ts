import ForbiddenException from '#exceptions/forbidden_exception'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class UserRoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { roles: string[] }) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const authUser = ctx.auth.getUserOrFail()
    await authUser.load('roles')

    const userRoles = authUser?.roles.map((role) => role.slug) ?? []
    const isMatched = options.roles.some((role) => userRoles.includes(role))

    // make sure user does not have active delete account request

    // const deleteAccountRequest = await UsersDeleteRequest.findBy({ user_id: authUser.id });

    if (!isMatched) {
      throw new ForbiddenException('You are not permitted to access this endpoint')
    }
    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}
