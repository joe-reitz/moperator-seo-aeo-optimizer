'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface SchemaData {
  context: string
  type: string
  headline: string
  description: string
  author: {
    type: string
    name: string
    url: string
  }
  publisher: {
    type: string
    name: string
    url: string
  }
  datePublished: string
  dateModified: string
  keywords: string[]
  articleSection: string
  inLanguage: string
  about: string[]
  audience: {
    type: string
    audienceType: string
  }
  speakable: {
    type: string
    cssSelector: string[]
  }
  faqPage: {
    context: string
    type: string
    mainEntity: Array<{
      type: string
      name: string
      acceptedAnswer: {
        type: string
        text: string
      }
    }>
  } | null
}

interface SchemaCardProps {
  schema: SchemaData | null
}

function formatSchemaForDisplay(schema: SchemaData): string {
  const blogPosting = {
    '@context': schema.context,
    '@type': schema.type,
    headline: schema.headline,
    description: schema.description,
    author: {
      '@type': schema.author.type,
      name: schema.author.name,
      url: schema.author.url,
    },
    publisher: {
      '@type': schema.publisher.type,
      name: schema.publisher.name,
      url: schema.publisher.url,
    },
    datePublished: schema.datePublished,
    dateModified: schema.dateModified,
    keywords: schema.keywords,
    articleSection: schema.articleSection,
    inLanguage: schema.inLanguage,
    about: schema.about,
    audience: {
      '@type': schema.audience.type,
      audienceType: schema.audience.audienceType,
    },
    speakable: {
      '@type': schema.speakable.type,
      cssSelector: schema.speakable.cssSelector,
    },
  }

  if (schema.faqPage) {
    const faqSchema = {
      '@context': schema.faqPage.context,
      '@type': schema.faqPage.type,
      mainEntity: schema.faqPage.mainEntity.map((item) => ({
        '@type': item.type,
        name: item.name,
        acceptedAnswer: {
          '@type': item.acceptedAnswer.type,
          text: item.acceptedAnswer.text,
        },
      })),
    }
    return JSON.stringify([blogPosting, faqSchema], null, 2)
  }

  return JSON.stringify(blogPosting, null, 2)
}

export function SchemaCard({ schema }: SchemaCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!schema) return
    await navigator.clipboard.writeText(formatSchemaForDisplay(schema))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!schema) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">AEO / Schema (JSON)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Structured schema.org data will appear here after generation.
          </p>
        </CardContent>
      </Card>
    )
  }

  const formattedSchema = formatSchemaForDisplay(schema)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">AEO / Schema (JSON)</CardTitle>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs font-mono text-foreground">
            <code>{formattedSchema}</code>
          </pre>
        </div>
        {schema.faqPage && (
          <p className="mt-3 text-xs text-muted-foreground">
            Includes FAQPage schema with {schema.faqPage.mainEntity.length} questions
          </p>
        )}
      </CardContent>
    </Card>
  )
}
