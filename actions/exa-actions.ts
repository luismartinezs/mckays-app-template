"use server"

import Exa from "exa-js"
import { ActionState, ExaSearchOptions, ExaSearchResult } from "@/types"

const exa = new Exa(process.env.EXA_API_KEY!)

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
      data: results
    }
  } catch (error) {
    console.error("Error performing Exa search:", error)
    return {
      isSuccess: false,
      message: "Failed to perform search"
    }
  }
}