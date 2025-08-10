import env from '#start/env'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import OpenAI from 'openai'

@inject()
export class OpenAIAdapter {
  private openai: OpenAI
  private readonly apiKey: string
  private readonly modelName: string

  constructor(private readonly ctx: HttpContext) {
    const envApiKey = env.get('OPENAI_API_KEY')
    this.apiKey = envApiKey || ''
    this.modelName = env.get('OPENAI_MODEL') || 'gpt-4o-mini'
    this.openai = new OpenAI({ apiKey: this.apiKey })
  }

  /**
   * Generate content with OpenAI model
   */
  public async generateContent(prompt: string): Promise<string> {
    try {
      const result = await this.openai.chat.completions.create({
        model: this.modelName,
        messages: [
          {
            role: 'system',
            content:
              'I specialize in wellness, meditation, and routines. I can assist with self-improvement and personal growth.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      })
      return result.choices[0]?.message?.content || ''
    } catch (error) {
      this.ctx.logger.error({ err: error, prompt }, 'Error generating content with OpenAi')
      throw error
    }
  }
}
