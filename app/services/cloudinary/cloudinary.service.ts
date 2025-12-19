import { MultipartFile } from '@adonisjs/core/bodyparser'
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'

export class CloudinaryService {
  constructor() {
    // Ensure Cloudinary is configured
    if (!cloudinary.config().cloud_name) {
      throw new Error(
        'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file'
      )
    }
  }

  async uploadFile(file: MultipartFile): Promise<UploadApiResponse> {
    // Validate file exists and has tmpPath
    if (!file || !file.tmpPath) {
      throw new Error('No file provided or file path is missing')
    }

    try {
      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(file.tmpPath, {
        resource_type: 'image', // Specify it's an image
        folder: 'profile_pictures', // Optional: organize in folders
        transformation: [
          { width: 500, height: 500, crop: 'fill' }, // Optional: resize/optimize
          { quality: 'auto' }, // Optional: auto quality
        ],
      })

      // Mark file as moved (cleanup temp file)
      await file.move('uploads', {
        name: file.clientName,
        overwrite: true,
      })

      return uploadResult
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error(`Failed to upload file: ${error.message}`)
    }
  }

  // Helper method to delete old profile pictures
  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      // Don't throw - deletion failure shouldn't break the flow
    }
  }
}
