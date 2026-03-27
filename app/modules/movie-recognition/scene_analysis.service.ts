const SYSTEM_CONTEXT = `You are a movie identification assistant with encyclopedic knowledge of films across all genres, decades, and countries. Based on the provided input, determine which movie it most likely comes from.`

const JSON_FORMAT_INSTRUCTION = `Return ONLY a valid JSON object with no additional text, markdown formatting, or code blocks. The JSON must follow this exact structure:
{
  "title": "Movie Title",
  "year": 2000,
  "confidence": 85,
  "reasoning": "Brief explanation of why this movie was identified",
  "possible_alternatives": [
    {
      "title": "Alternative Movie Title",
      "year": 2001,
      "confidence": 40,
      "reasoning": "Brief explanation"
    }
  ]
}

Rules:
- "confidence" is a number from 0 to 100
- "possible_alternatives" should contain up to 3 alternative matches
- If you cannot identify any movie, set confidence to 0 and explain in reasoning`

export class SceneAnalysisService {
  buildTextPrompt(description: string): string {
    return `${SYSTEM_CONTEXT}

Scene Description:
${description}

${JSON_FORMAT_INSTRUCTION}`
  }

  buildImagePrompt(): string {
    return `${SYSTEM_CONTEXT}

Analyze the provided image carefully. Look for visual cues such as:
- Actors and their appearances
- Set design, costumes, and props
- Cinematography style and color grading
- Any visible text, logos, or watermarks
- The overall mood and genre indicators

Based on your analysis, identify the movie this image is most likely from.

${JSON_FORMAT_INSTRUCTION}`
  }

  buildVideoFramesPrompt(): string {
    return `${SYSTEM_CONTEXT}

Analyze the provided video frames carefully. These frames are extracted from a short video clip. Look for visual cues across the frames such as:
- Actors and their appearances
- Set design, costumes, and props
- Action sequences or scene progression
- Cinematography style and color grading
- Any visible text, logos, or watermarks
- The overall mood and genre indicators

Based on your analysis of all frames together, identify the movie this clip is most likely from.

${JSON_FORMAT_INSTRUCTION}`
  }
}
