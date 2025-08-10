import { BaseController } from '#base/base.controller';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { HttpStatus } from '../../../../interfaces/http.enum.js';
import User from '../../../models/user.js';
import { PasswordResetService } from './password_reset_service.js';
import { changePasswordValidator } from './validators/changePasswordValidator.js';
import { passwordResetValidator } from './validators/passwordResetValidator.js';
import { updatePasswordValidator } from './validators/updatePasswordValidator.js';
import { verifyPasswordTokenValidator } from './validators/verifyPasswordTokenValidator.js';

@inject()
export default class PasswordResetController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private passwordResetService: PasswordResetService,
  ) {
    super();
  }

  public async initiate() {
    const data = await this.ctx.request.validateUsing(passwordResetValidator);

    const passwordReset = await this.passwordResetService.create(data.email);

    return this.transformResponse('Password reset mail sent successfully', passwordReset, HttpStatus.CREATED);
  }

  public async verifyToken() {
    const data = await this.ctx.request.validateUsing(verifyPasswordTokenValidator);
    let user: User;
    if (data.password) {
      console.log('Got here');
      user = await this.passwordResetService.updatePassword(data as any);
    } else {
      user = await this.passwordResetService.verifyToken(data.email, data.token);
    }

    return this.transformResponse('SuccessFully verified user', user, HttpStatus.CREATED);
  }

  public async updatePassword() {
    const data = await this.ctx.request.validateUsing(updatePasswordValidator);
    const user = await this.passwordResetService.updatePassword({
      password: data.password,
      email: data.email,
      token: data.token,
    });

    return this.transformResponse('SuccessFul', user, HttpStatus.CREATED)
  }

  async changePassword() {
    const data = await this.ctx.request.validateUsing(changePasswordValidator)
    const userId = this.ctx.auth.user?.id

    const user = await this.passwordResetService.changePassword(userId as number, {
      confirm_new_password: data.password,
      new_password: data.password,
      current_password: data.current_password,
    })

    return this.transformResponse('SuccessFul', user, HttpStatus.CREATED)
  }
}
