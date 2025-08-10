import { MultipartFile } from '@adonisjs/core/bodyparser'
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary'

export class CloudinaryService {
  async uploadFile(file: MultipartFile): Promise<UploadApiErrorResponse | UploadApiResponse> {
    return new Promise(async (res, rej) => {
      try {
        const upload = await v2.uploader.upload(file.tmpPath as string)
        res(upload)
        file.markAsMoved(file.fileName as string, file.filePath as string)
      } catch (e) {
        rej(e.message)
      }
    })
  }
}
