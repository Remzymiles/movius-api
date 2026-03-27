export interface MovieMatch {
  title: string
  year: number
  confidence: number
  reasoning: string
}

export interface MovieRecognitionResult {
  match: MovieMatch
  possible_alternatives: MovieMatch[]
  media_url?: string
}

export interface MovieRecognitionAIResponse {
  title: string
  year: number
  confidence: number
  reasoning: string
  possible_alternatives: {
    title: string
    year: number
    confidence: number
    reasoning: string
  }[]
}
