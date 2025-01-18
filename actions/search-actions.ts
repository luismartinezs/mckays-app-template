"use server"

import { exaSearchAction } from "./exa-actions"
import { chatCompletionAction } from "./openai-actions"
import { ActionState, ExaSearchResult } from "@/types"

export async function searchWithSummariesAction(
  query: string
): Promise<ActionState<{ results: ExaSearchResult[]; summary: string | undefined }>> {
  try {
    // Get search results from Exa
    const searchResult = await exaSearchAction(query, {
      type: "auto",
      text: true,
      limit: 5
    })

    if (!searchResult.isSuccess) {
      return {
        isSuccess: false,
        message: searchResult.message,
        data: { results: [], summary: undefined }
      }
    }

    // Combine all texts for a single summary
    const combinedText = searchResult.data
      .map((result, index) => `Source ${index + 1}:\n${result.text}`)
      .join("\n\n")

    console.log("Combined text length:", combinedText.length)

    // Generate a single summary using OpenAI
    const summaryResponse = await chatCompletionAction(
      [
        {
          role: "system",
          content: "You are a helpful assistant that creates comprehensive summaries. Analyze multiple sources and create a coherent summary that captures the key information and insights from all sources. Structure your response in clear paragraphs."
        },
        {
          role: "user",
          content: `Please provide a comprehensive summary of the following texts from multiple sources:\n\n${combinedText}`
        }
      ],
      {
        model: "gpt-4o-mini",
        temperature: 0.7,
      }
    )

    console.log("OpenAI Response:", summaryResponse)

    if (!summaryResponse.isSuccess) {
      console.error("Failed to generate summary:", summaryResponse.message)
    }

    return {
      isSuccess: true,
      message: "Search and summary completed successfully",
      data: {
        results: searchResult.data,
        summary: summaryResponse.isSuccess && summaryResponse.data.message.content ? summaryResponse.data.message.content : undefined
      }
    }
  } catch (error) {
    console.error("Error in search with summaries:", error)
    return {
      isSuccess: false,
      message: "Failed to perform search with summaries",
      data: { results: [], summary: undefined }
    }
  }
}