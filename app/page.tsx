"use client"

import { useState } from "react"
import { searchWithSummariesAction } from "@/actions/search-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ExaSearchResult } from "@/types"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CalendarIcon, Loader2Icon, UserIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface SearchResults {
  results: ExaSearchResult[]
  summary: string | undefined
}

export default function Page() {
  const [query, setQuery] = useState("")
  const [searchData, setSearchData] = useState<SearchResults>({
    results: [],
    summary: undefined
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await searchWithSummariesAction(query)
      console.log("Search result:", result)

      if (result.isSuccess) {
        setSearchData(result.data)
        if (!result.data.summary) {
          setError("Failed to generate summary. Please try again.")
        }
      } else {
        setError(result.message)
      }
    } catch (err) {
      console.error("Search error:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-4xl font-bold">AI-Powered Search</h1>
        <p className="text-muted-foreground">
          Search across multiple sources and get an AI-generated summary
        </p>
      </div>

      <div className="flex w-full max-w-lg items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter your search query..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
          className="h-12"
          disabled={loading}
        />

        <Button
          onClick={handleSearch}
          disabled={loading}
          size="lg"
          className="min-w-[120px] px-8"
        >
          {loading ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Searching...
            </>
          ) : (
            "Search"
          )}
        </Button>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {searchData.results.length > 0 && (
        <div className="mt-8">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4 p-4">
              {searchData.results.map(result => (
                <a
                  key={result.id}
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Card className="h-[180px] w-[300px] transition-all hover:scale-105 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex h-full flex-col justify-between space-y-4">
                        <div className="line-clamp-2 text-lg font-semibold">
                          {result.title}
                        </div>
                        <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
                          {result.author && (
                            <div className="flex items-center gap-1">
                              <UserIcon className="size-3" />
                              <span className="max-w-[100px] truncate">
                                {result.author}
                              </span>
                            </div>
                          )}
                          {result.publishedDate && (
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="size-3" />
                              <span>
                                {new Date(
                                  result.publishedDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {result.score && (
                            <div className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                              Score: {result.score.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </a>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {loading && searchData.results.length > 0 && (
        <Card className="mt-8">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2Icon className="mr-2 size-6 animate-spin" />
            <span className="text-lg">Generating summary...</span>
          </CardContent>
        </Card>
      )}

      {searchData.summary && !loading && (
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">AI Summary</h2>
              <div className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                Based on {searchData.results.length} sources
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <ReactMarkdown
                components={{
                  // Style headings
                  h1: ({ children }) => (
                    <h1 className="mb-4 text-2xl font-bold">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-3 text-xl font-bold">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mb-2 text-lg font-bold">{children}</h3>
                  ),
                  // Style paragraphs
                  p: ({ children }) => (
                    <p className="mb-4 text-lg leading-relaxed last:mb-0">
                      {children}
                    </p>
                  ),
                  // Style lists
                  ul: ({ children }) => (
                    <ul className="mb-4 list-disc pl-6">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="mb-4 list-decimal pl-6">{children}</ol>
                  ),
                  // Style list items
                  li: ({ children }) => (
                    <li className="mb-2 text-lg">{children}</li>
                  ),
                  // Style blockquotes
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-200 pl-4 italic">
                      {children}
                    </blockquote>
                  ),
                  // Style code blocks
                  code: ({ children }) => (
                    <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-sm">
                      {children}
                    </code>
                  )
                }}
              >
                {searchData.summary}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
