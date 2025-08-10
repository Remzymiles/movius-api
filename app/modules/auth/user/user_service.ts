import BadRequestException from '#exceptions/bad_request_exception'
import ForbiddenException from '#exceptions/forbidden_exception'
import DeleteAccountNotification from '#mails/delete_account_notification'
import User from '#models/user'
import { inject } from '@adonisjs/core'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import logger from '@adonisjs/core/services/logger'
import mail from '@adonisjs/mail/services/main'
import { Infer } from '@vinejs/vine/types'
import { CloudinaryService } from '../../../services/cloudinary/cloudinary.service.js'
import { changePasswordValidator } from './validators/changePasswordValidator.js'

@inject()
export class UserService {
  constructor(
    private ctx: HttpContext,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  public async update(data: Partial<User>, profilePic?: MultipartFile) {
    const user = this.ctx.auth.user as User

    if (profilePic) {
      try {
        const uploadedFile = await this.cloudinaryService.uploadFile(profilePic)

        user.avatar_url = uploadedFile.secure_url
      } catch (e) {
        logger.info(e)
      }
    }

    await user
      .merge({
        full_name: data.full_name ?? user.full_name,
        phone: data.phone ?? user.phone,
        email: data.email ?? user.email,
      })
      .save()

    return user.toJSON()
  }

  public async deleteAccount() {
    const user = this.ctx.auth.user as User
    // cleanup account

    // delete account
    await user.delete()

    await mail.sendLater(new DeleteAccountNotification(user.email, user.full_name))
  }
  public async changePassword(data: Infer<typeof changePasswordValidator>) {
    const user = this.ctx.auth.getUserOrFail()

    // check old password
    const isValid = await hash.verify(user.password, data.old_password)

     if (!isValid) {
      throw new ForbiddenException('Old password is incorrect')
    }

    // Check if new password matches the current hashed password
    const isNewPasswordSameAsOld = await hash.verify(user.password, data.password)
    if (isNewPasswordSameAsOld) {
      throw new BadRequestException('New password cannot be the same as the old password')
    }

    console.log(isNewPasswordSameAsOld)

   

    // update password
    user.password = data.password
    await user.save()

    return user.toJSON()
  }
}
