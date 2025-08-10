import { IResponse } from '#interfaces/base.interface';
import { HttpStatus } from '#interfaces/http.enum';
import { inject } from '@adonisjs/core';

@inject()
export class BaseController {
  protected async transformResponse(message: string, data?: any, statusCode: number = HttpStatus.OK): Promise<IResponse> {
    data = await data;
    const dateTime = new Date().toISOString();
    return {
      statusCode,
      message,
      data,
      timestamp: dateTime,
    };
  }
}
