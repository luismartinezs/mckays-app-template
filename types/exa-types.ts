export interface ExaSearchResult {
  id: string
  url: string
  title: string
  author: string
  publishedDate: string
  text: string
  score?: number
  summary?: string
}

export interface TextContentsOptions {
  type?: "markdown" | "text"
  maxTokens?: number
}

export interface ExaSearchOptions {
  type?: "auto" | "semantic" | "keyword" | "hybrid"
  limit?: number
  offset?: number
  text?: true | TextContentsOptions
}
