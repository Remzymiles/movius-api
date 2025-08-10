import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { HttpContext } from '@adonisjs/core/http'
import { HttpStatus } from '../../../../interfaces/http.enum.js'
import { BaseController } from '../../../base/base.controller.js'
import { UserService } from './user_service.js'
import { changePasswordValidator } from './validators/changePasswordValidator.js'
import { updateUserValidation } from './validators/updateUserValidation.js'

@inject()
export default class UserController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private userService: UserService
  ) {
    super()
  }

  public async update() {
    const file = this.ctx.request.file('profile_pic')

    const data = await this.ctx.request.validateUsing(updateUserValidation)

    const updatedUser = await this.userService.update(data, file as MultipartFile)

    return this.transformResponse('user profile updated', updatedUser, HttpStatus.CREATED)
  }

  public async getAuthenticatedUser() {
    const user = this.ctx.auth.getUserOrFail()

    return this.transformResponse('Authenticated user fetched successfully', user)
  }

  public async changePassword() {
    const data = await this.ctx.request.validateUsing(changePasswordValidator)

    const updatedUser = await this.userService.changePassword(data)

    return this.transformResponse('User password updated successfully', updatedUser)
  }
}
