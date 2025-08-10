import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import db from '@adonisjs/lucid/services/db';
import mail from '@adonisjs/mail/services/main';
import { Pagination } from '../../../../interfaces/model.interface.js';
import ForbiddenException from '../../../exceptions/forbidden_exception.js';
import UsersDeleteRequest from '#models/users_delete_request';
import UserDeleteRequestNotification from '#mails/user_delete_request_notification';
import { isAdmin } from '#abilities/main';

@inject()
export class UserDeleteRequestService {
  constructor(private ctx: HttpContext) {}

  async requestAccountDeletion() {
    const user = this.ctx.auth.getUserOrFail();

    const accountDeletionRequest = await UsersDeleteRequest.create({
      status: 'pending',
      user_id: user.id,
    });

    // send mail
    await mail.sendLater(new UserDeleteRequestNotification(user));

    return accountDeletionRequest;
  }

  public async approveDeleteRequest(id: number) {
    // is user admin
    if (await this.ctx.bouncer.denies(isAdmin)) {
      throw new ForbiddenException('cannot approve delete request');
    }

    const trx = await db.transaction();
    try {
      const accountDeletionRequest = await UsersDeleteRequest.findOrFail(id);

      await trx.query().from('users').where('id', accountDeletionRequest.user_id).delete();

      await trx.query().from('users_delete_requests').where('id', accountDeletionRequest.id).update({
        status: 'approved',
      });

      await trx.commit();
    } catch (e) {
      await trx.rollback();
      throw e;
    }
  }

  public async removeDeleteRequest(id: number) {
    // is user admin
    if (await this.ctx.bouncer.denies(isAdmin)) {
      throw new ForbiddenException('');
    }

    return (await UsersDeleteRequest.findOrFail(id)).delete();
  }

  public async findAll({ page, size }: Pagination) {
    return UsersDeleteRequest.query().paginate(page as number, size);
  }

  public async findOne(id: number) {
    return UsersDeleteRequest.findOrFail(id);
  }
}
