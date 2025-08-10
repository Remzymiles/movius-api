import { BaseController } from '#base/base.controller';
import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { HttpStatus } from '../../../../interfaces/http.enum.js';
import RegisterService from './register_service.js';
import { checkRegisterUserValidator } from './validator/check-register-user.dto.js';
import { registerUserValidator } from './validator/register-user.dto.js';
import { resendUserVerificationOtpValidator } from './validator/resend-verification-otp-user.dto.js';
import { verifyEmailOtpValidator } from './validator/verify-email-otp-user.dto.js';

@inject()
export default class RegistersController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private registerService: RegisterService,
  ) {
    super();
  }

  public async register() {
    // validate request
    const data = await this.ctx.request.validateUsing(registerUserValidator);

    // register user
    const registeredUser = await this.registerService.registerUser(data);
    return this.transformResponse('User registered successfully', registeredUser, HttpStatus.CREATED);
  }

  public async resendVerificationMail() {
    const data = await this.ctx.request.validateUsing(resendUserVerificationOtpValidator);

    // perform resend verification
    await this.registerService.resendVerificationMail(data.email);

    return this.transformResponse('Verification mail sent successfully', undefined, HttpStatus.CREATED);
  }

  public async checkRegisterUserDetails() {
    await this.ctx.request.validateUsing(checkRegisterUserValidator);

    return this.transformResponse('User data passed verification successfully', undefined, HttpStatus.CREATED);
  }

  public async verifyAccount() {
    const data = await this.ctx.request.validateUsing(verifyEmailOtpValidator);

    // perform resend verification
    const verificationData = await this.registerService.verifyAccount(data.email, data.token);

    return this.transformResponse('Email verified successfully', verificationData, HttpStatus.CREATED);
  }
}
