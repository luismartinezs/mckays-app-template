"use server"

import Exa, { type SearchResult, type TextContentsOptions } from "exa-js"
import { ActionState, ExaSearchResult } from "@/types"

const exa = new Exa(process.env.EXA_API_KEY!)

export interface ExaSearchOptions {
  type?: string
  text?: true | TextContentsOptions
  limit?: number
}

export async function exaSearchAction(
  query: string,
  options: ExaSearchOptions = { type: "auto", text: true }
): Promise<ActionState<ExaSearchResult[]>> {
  try {
    const response = await exa.searchAndContents(query, options)
    const results = response.results || []
    return {
      isSuccess: true,
      message: "Search completed successfully",
      data: results.map(r => ({
        title: r.title ?? null,
        url: r.url,
        author: r.author ?? null,
        publishedDate: r.publishedDate ?? null,
        text: r.text ?? null
      }))
    }
  } catch (error) {
    console.error("Error performing Exa search:", error)
    return {
      isSuccess: false,
      message: "Failed to perform search"
    }
  }
}