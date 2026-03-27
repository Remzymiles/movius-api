import env from '#start/env'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { genkit, type Genkit } from 'genkit'
import { xAI } from '@genkit-ai/compat-oai/xai'
import InternalServerErrorException from '#exceptions/internal_server_error_exception'

@inject()
export class GenkitAIAdapter {
  private readonly ai: Genkit
  private readonly modelName: string

  constructor(private readonly ctx: HttpContext) {
    const apiKey = env.get('XAI_API_KEY')
    this.modelName = env.get('GROK_MODEL') || 'grok-3-mini-fast'

    this.ai = genkit({
      plugins: [xAI({ apiKey })],
    })
  }

  public async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.ai.generate({
        model: xAI.model(this.modelName),
        prompt,
        config: { temperature: 0.3 },
      })
      return result.text
    } catch (error) {
      this.ctx.logger.error({ err: error, prompt }, 'Error generating content with Grok')
      throw new InternalServerErrorException(
        `Failed to generate AI response: ${error.message}`
      )
    }
  }

  public async analyzeMedia(prompt: string, mediaUrls: string[]): Promise<string> {
    try {
      const mediaParts = mediaUrls.map((url) => ({ media: { url } }))

      const result = await this.ai.generate({
        model: xAI.model('grok-2-vision-1212'),
        prompt: [...mediaParts, { text: prompt }],
        config: { temperature: 0.3 },
      })
      return result.text
    } catch (error) {
      this.ctx.logger.error({ err: error }, 'Error analyzing media with Grok Vision')
      throw new InternalServerErrorException(
        `Failed to analyze media with AI: ${error.message}`
      )
    }
  }
}
