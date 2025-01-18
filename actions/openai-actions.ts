"use server"

import OpenAI from "openai"
import { ActionState, ChatCompletionOptions, ChatCompletionResponse, ChatMessage } from "@/types"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function chatCompletionAction(
  messages: ChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<ActionState<ChatCompletionResponse>> {
  try {
    const completion = await openai.chat.completions.create({
      messages: messages as any[],
      model: options.model || "gpt-4o-mini",
      temperature: options.temperature,
      top_p: options.top_p,
      frequency_penalty: options.frequency_penalty,
      presence_penalty: options.presence_penalty,
      stop: options.stop
    })

    const response: ChatCompletionResponse = {
      id: completion.id,
      message: {
        role: completion.choices[0].message.role,
        content: completion.choices[0].message.content,
        ...(completion.choices[0].message.function_call && {
          function_call: completion.choices[0].message.function_call
        })
      },
      finish_reason: completion.choices[0].finish_reason,
      created: completion.created
    }

    return {
      isSuccess: true,
      message: "Chat completion successful",
      data: response
    }
  } catch (error) {
    console.error("Error in chat completion:", error)
    return {
      isSuccess: false,
      message: "Failed to get chat completion"
    }
  }
}