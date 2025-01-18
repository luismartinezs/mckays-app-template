export type ChatMessageRole = "system" | "user" | "assistant" | "function"

export interface ChatMessage {
  role: ChatMessageRole
  content: string | null
  name?: string
  function_call?: {
    name: string
    arguments: string
  }
}

export interface ChatCompletionOptions {
  model?: string
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  stop?: string | string[]
}

export interface ChatCompletionResponse {
  id: string
  message: ChatMessage
  finish_reason: string | null
  created: number
}
