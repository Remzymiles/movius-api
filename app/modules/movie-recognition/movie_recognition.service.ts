import { MultipartFile } from '@adonisjs/core/bodyparser'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { GenkitAIAdapter } from '#adapters/llms/genkit/genkit_ai.adapter'
import { MediaUploadService } from '#services/cloudinary/media_upload.service'
import { SceneAnalysisService } from './scene_analysis.service.js'
import type { MovieRecognitionAIResponse, MovieRecognitionResult } from './movie_recognition.interface.js'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'

@inject()
export class MovieRecognitionService {
  constructor(
    private readonly ctx: HttpContext,
    private readonly genkitAI: GenkitAIAdapter,
    private readonly mediaUpload: MediaUploadService,
    private readonly sceneAnalysis: SceneAnalysisService
  ) {}

  async recognizeFromText(description: string): Promise<MovieRecognitionResult> {
    const prompt = this.sceneAnalysis.buildTextPrompt(description)
    const aiResponse = await this.genkitAI.generateContent(prompt)
    return this.parseAIResponse(aiResponse)
  }

  async recognizeFromImage(file: MultipartFile): Promise<MovieRecognitionResult> {
    const uploadResult = await this.mediaUpload.uploadImage(file)
    const prompt = this.sceneAnalysis.buildImagePrompt()
    const aiResponse = await this.genkitAI.analyzeMedia(prompt, [uploadResult.secure_url])
    const result = this.parseAIResponse(aiResponse)
    result.media_url = uploadResult.secure_url
    return result
  }

  async recognizeFromVideo(file: MultipartFile): Promise<MovieRecognitionResult> {
    const uploadResult = await this.mediaUpload.uploadVideo(file)
    const frameUrls = this.mediaUpload.extractVideoFrames(uploadResult.public_id)
    const prompt = this.sceneAnalysis.buildVideoFramesPrompt()
    const aiResponse = await this.genkitAI.analyzeMedia(prompt, frameUrls)
    const result = this.parseAIResponse(aiResponse)
    result.media_url = uploadResult.secure_url
    return result
  }

  private parseAIResponse(raw: string): MovieRecognitionResult {
    try {
      const cleaned = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()
      const parsed: MovieRecognitionAIResponse = JSON.parse(cleaned)

      return {
        match: {
          title: parsed.title,
          year: parsed.year,
          confidence: parsed.confidence,
          reasoning: parsed.reasoning,
        },
        possible_alternatives: (parsed.possible_alternatives || []).map((alt) => ({
          title: alt.title,
          year: alt.year,
          confidence: alt.confidence,
          reasoning: alt.reasoning,
        })),
      }
    } catch (error) {
      this.ctx.logger.error({ err: error, raw }, 'Failed to parse AI response')
      throw new InternalServerErrorException(
        'Failed to parse movie recognition response from AI'
      )
    }
  }
}
