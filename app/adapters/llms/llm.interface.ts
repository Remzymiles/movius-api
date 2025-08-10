export interface LLMResponse {
  content: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface LLMManagement {
  generateText(prompt: string, options?: LLMOptions): Promise<LLMResponse>
}

export interface LLMOptions {
  temperature?: number
  max_tokens?: number
  model?: string
  stream?: boolean
}
