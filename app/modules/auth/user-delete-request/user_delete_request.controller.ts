import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { HttpStatus } from '../../../../interfaces/http.enum.js';
import { BaseController } from '../../../base/base.controller.js';
import { UserDeleteRequestService } from './user_delete_request.service.js';

@inject()
export class UserDeleteRequestController extends BaseController {
  constructor(
    private ctx: HttpContext,
    private readonly userDeleteRequestService: UserDeleteRequestService,
  ) {
    super();
  }

  public async requestAccountDeletion() {
    const accountDeletionRequest = await this.userDeleteRequestService.requestAccountDeletion();

    return this.transformResponse('Account delete request is successful', accountDeletionRequest, HttpStatus.CREATED);
  }

  public async approveDeleteRequest() {
    const id = this.ctx.request.param('id');

    const accountDeletionRequest = await this.userDeleteRequestService.approveDeleteRequest(id);

    return this.transformResponse(
      'Account delete request approved successfully',
      accountDeletionRequest,
      HttpStatus.OK,
    );
  }

  public async removeDeleteRequest() {
    const id = this.ctx.request.param('id');

    const accountDeletionRequest = await this.userDeleteRequestService.removeDeleteRequest(id);

    return this.transformResponse(
      'Account delete request disapproved successfully',
      accountDeletionRequest,
      HttpStatus.OK,
    );
  }

  public async findAll() {
    const { page, size } = this.ctx.request.qs();

    const accountDeletionRequest = await this.userDeleteRequestService.findAll({ page, size });

    return this.transformResponse(
      'Account delete requests fetched successfully',
      accountDeletionRequest,
      HttpStatus.OK,
    );
  }

  public async findOne() {
    const id = this.ctx.request.param('id');

    const accountDeletionRequest = await this.userDeleteRequestService.findOne(id);

    return this.transformResponse('Account delete request fetched successfully', accountDeletionRequest, HttpStatus.OK);
  }
}
