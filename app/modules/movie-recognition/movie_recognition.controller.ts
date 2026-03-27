import { BaseController } from '#base/base.controller'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { MovieRecognitionService } from './movie_recognition.service.js'
import { textRecognitionValidator } from './validators/text_recognition.validator.js'
import BadRequestException from '#exceptions/bad_request_exception'

@inject()
export default class MovieRecognitionController extends BaseController {
  constructor(
    protected ctx: HttpContext,
    private movieRecognitionService: MovieRecognitionService
  ) {
    super()
  }

  async recognizeFromText() {
    const { description } = await this.ctx.request.validateUsing(textRecognitionValidator)
    const result = await this.movieRecognitionService.recognizeFromText(description)
    return this.transformResponse('Movie recognized from text description', result)
  }

  async recognizeFromImage() {
    const file = this.ctx.request.file('image', {
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'],
      size: '10mb',
    })

    if (!file) {
      throw new BadRequestException('Image file is required')
    }

    if (!file.isValid) {
      throw new BadRequestException(file.errors.map((e) => e.message).join(', '))
    }

    const result = await this.movieRecognitionService.recognizeFromImage(file)
    return this.transformResponse('Movie recognized from image', result)
  }

  async recognizeFromVideo() {
    const file = this.ctx.request.file('video', {
      extnames: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
      size: '50mb',
    })

    if (!file) {
      throw new BadRequestException('Video file is required')
    }

    if (!file.isValid) {
      throw new BadRequestException(file.errors.map((e) => e.message).join(', '))
    }

    const result = await this.movieRecognitionService.recognizeFromVideo(file)
    return this.transformResponse('Movie recognized from video', result)
  }
}
