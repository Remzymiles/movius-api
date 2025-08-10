import { BaseController } from '#base/base.controller';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { HttpStatus } from '../../../../interfaces/http.enum.js';
import LoginService from './login_service.js';
import { loginValidator } from './validator/loginValidator.js';

@inject()
export default class LoginController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private readonly loginService: LoginService,
  ) {
    super();
  }

  public async login() {
    // validate request
    const data = await this.ctx.request.validateUsing(loginValidator);

    // login user
    const registeredUser = await this.loginService.login(data.email, data.password);
    return this.transformResponse('User login successfully', registeredUser, HttpStatus.CREATED);
  }
}
