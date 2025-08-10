import { BaseController } from '#base/base.controller'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { OpenAIAdapter } from './openai.adapter.js'

@inject()
export default class OpenAIController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private openAIAdapter: OpenAIAdapter
  ) {
    super()
  }

  public async generateContent() {
    const { prompt } = this.ctx.request.body()
    const response = await this.openAIAdapter.generateContent(prompt)
    return this.transformResponse('Success', { content: response })
  }
}
