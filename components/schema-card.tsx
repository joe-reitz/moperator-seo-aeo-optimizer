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
  abstract: string
  url: string
  mainEntityOfPage: {
    type: string
    id: string
  }
  isPartOf: {
    type: string
    name: string
    url: string
  }
  image: string
  thumbnailUrl: string
  wordCount: number
  isAccessibleForFree: boolean
  author: {
    type: string
    name: string
    url: string
    sameAs: string[]
  }
  publisher: {
    type: string
    name: string
    url: string
    logo: {
      type: string
      url: string
    }
  }
  datePublished: string
  dateModified: string
  keywords: string[]
  articleSection: string
  inLanguage: string
  about: Array<{
    type: string
    name: string
    description: string
    sameAs?: string
  }>
  mentions: Array<{
    type: string
    name: string
    sameAs?: string
  }>
  audience: {
    type: string
    audienceType: string
  }
  speakable: {
    type: string
    cssSelector: string[]
  }
  hasPart: Array<{
    type: string
    name: string
    cssSelector: string
  }>
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
  howTo: {
    context: string
    type: string
    name: string
    description: string
    step: Array<{
      type: string
      name: string
      text: string
    }>
  } | null
}

interface SchemaCardProps {
  schema: SchemaData | null
}

function formatSchemaForDisplay(schema: SchemaData): string {
  const blogPosting: Record<string, unknown> = {
    '@context': schema.context,
    '@type': schema.type,
    mainEntityOfPage: {
      '@type': schema.mainEntityOfPage.type,
      '@id': schema.mainEntityOfPage.id,
    },
    isPartOf: {
      '@type': schema.isPartOf.type,
      name: schema.isPartOf.name,
      url: schema.isPartOf.url,
    },
    headline: schema.headline,
    description: schema.description,
    abstract: schema.abstract,
    url: schema.url,
    image: schema.image,
    thumbnailUrl: schema.thumbnailUrl,
    wordCount: schema.wordCount,
    isAccessibleForFree: schema.isAccessibleForFree,
    author: {
      '@type': schema.author.type,
      name: schema.author.name,
      url: schema.author.url,
      ...(schema.author.sameAs.length > 0 && { sameAs: schema.author.sameAs }),
    },
    publisher: {
      '@type': schema.publisher.type,
      name: schema.publisher.name,
      url: schema.publisher.url,
      logo: {
        '@type': schema.publisher.logo.type,
        url: schema.publisher.logo.url,
      },
    },
    datePublished: schema.datePublished,
    dateModified: schema.dateModified,
    keywords: schema.keywords,
    articleSection: schema.articleSection,
    inLanguage: schema.inLanguage,
    about: schema.about.map((item) => ({
      '@type': item.type,
      name: item.name,
      description: item.description,
      ...(item.sameAs && { sameAs: item.sameAs }),
    })),
    mentions: schema.mentions.map((item) => ({
      '@type': item.type,
      name: item.name,
      ...(item.sameAs && { sameAs: item.sameAs }),
    })),
    audience: {
      '@type': schema.audience.type,
      audienceType: schema.audience.audienceType,
    },
    speakable: {
      '@type': schema.speakable.type,
      cssSelector: schema.speakable.cssSelector,
    },
    hasPart: schema.hasPart.map((item) => ({
      '@type': item.type,
      name: item.name,
      cssSelector: item.cssSelector,
    })),
  }

  const schemas: unknown[] = [blogPosting]

  if (schema.faqPage) {
    schemas.push({
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
    })
  }

  if (schema.howTo) {
    schemas.push({
      '@context': schema.howTo.context,
      '@type': schema.howTo.type,
      name: schema.howTo.name,
      description: schema.howTo.description,
      step: schema.howTo.step.map((item) => ({
        '@type': item.type,
        name: item.name,
        text: item.text,
      })),
    })
  }

  if (schemas.length === 1) {
    return JSON.stringify(schemas[0], null, 2)
  }

  return JSON.stringify(schemas, null, 2)
}

function countSchemaTypes(schema: SchemaData): string[] {
  const types = [schema.type]
  if (schema.faqPage) types.push('FAQPage')
  if (schema.howTo) types.push('HowTo')
  return types
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
          <CardTitle className="text-base font-medium">AEO / Schema (JSON-LD)</CardTitle>
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
  const schemaTypes = countSchemaTypes(schema)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium">AEO / Schema (JSON-LD)</CardTitle>
            <div className="flex gap-1.5">
              {schemaTypes.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground"
                >
                  {type}
                </span>
              ))}
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground">
                {schema.about.length} concepts
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-secondary text-secondary-foreground">
                {schema.mentions.length} entities
              </span>
            </div>
          </div>
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
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs font-mono text-foreground max-h-[500px]">
            <code>{formattedSchema}</code>
          </pre>
        </div>
        {schema.abstract && (
          <div className="mt-3 space-y-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              AI Answer Extract
            </span>
            <p className="text-xs text-foreground leading-relaxed">
              {schema.abstract}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
