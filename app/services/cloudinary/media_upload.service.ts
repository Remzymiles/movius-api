import { MultipartFile } from '@adonisjs/core/bodyparser'
import { UploadApiResponse, v2 } from 'cloudinary'
import env from '#start/env'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'
import BadRequestException from '#exceptions/bad_request_exception'

export class MediaUploadService {
  constructor() {
    v2.config({
      cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
      api_key: env.get('CLOUDINARY_API_KEY'),
      api_secret: env.get('CLOUDINARY_API_SECRET'),
    })
  }

  async uploadImage(file: MultipartFile): Promise<UploadApiResponse> {
    if (!file.tmpPath) {
      throw new BadRequestException('Image file is missing or could not be processed')
    }

    try {
      const result = await v2.uploader.upload(file.tmpPath, {
        resource_type: 'image',
        folder: 'movie-recognition/images',
      })
      file.markAsMoved(file.fileName as string, file.filePath as string)
      return result
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to upload image to Cloudinary: ${error.message}`
      )
    }
  }

  async uploadVideo(file: MultipartFile): Promise<UploadApiResponse> {
    if (!file.tmpPath) {
      throw new BadRequestException('Video file is missing or could not be processed')
    }

    try {
      const result = await v2.uploader.upload(file.tmpPath, {
        resource_type: 'video',
        folder: 'movie-recognition/videos',
      })
      file.markAsMoved(file.fileName as string, file.filePath as string)
      return result
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to upload video to Cloudinary: ${error.message}`
      )
    }
  }

  extractVideoFrames(publicId: string, count: number = 4): string[] {
    const frames: string[] = []
    for (let i = 1; i <= count; i++) {
      const offset = Math.round((i / (count + 1)) * 100) / 100
      const url = v2.url(publicId, {
        resource_type: 'video',
        format: 'jpg',
        transformation: [{ start_offset: `${offset}p` }, { width: 640, crop: 'scale' }],
      })
      frames.push(url)
    }
    return frames
  }
}
