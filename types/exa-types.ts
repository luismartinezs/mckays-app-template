export interface ExaSearchResult {
  title: string | null
  url: string
  author: string | null
  publishedDate: string | null
  text: string | null
}

export interface TextContentsOptions {
  type?: "markdown" | "text"
  maxTokens?: number
}

export interface ExaSearchOptions {
  type?: string
  text?: true | TextContentsOptions
  limit?: number
}
