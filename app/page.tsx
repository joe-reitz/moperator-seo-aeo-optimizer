'use client'

import { useState } from 'react'
import { SEOInputForm } from '@/components/seo-input-form'
import { SEOMetadataCard } from '@/components/seo-metadata-card'
import { SchemaCard } from '@/components/schema-card'
import { OGPreviewCard } from '@/components/og-preview-card'

interface SEOResult {
  seoTitle: string
  metaDescription: string
  slug: string
  canonicalUrl: string
  primaryKeyword: string
  secondaryKeywords: string[]
  schema: {
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
}

interface OGResult {
  prompt: string
  imageUrl: string | null
  message?: string
}

export default function SEOOptimizerPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [targetKeyword, setTargetKeyword] = useState('')
  const [audiencePersona, setAudiencePersona] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [seoResult, setSeoResult] = useState<SEOResult | null>(null)
  const [ogResult, setOgResult] = useState<OGResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Generate SEO metadata and schema
      const seoResponse = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          body,
          targetKeyword,
          audiencePersona,
        }),
      })

      if (!seoResponse.ok) {
        throw new Error('Failed to generate SEO metadata')
      }

      const seoData = await seoResponse.json()
      setSeoResult(seoData.seo)

      // Generate OG image prompt
      const ogResponse = await fetch('/api/generate-og', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description: seoData.seo?.metaDescription || '',
        }),
      })

      if (!ogResponse.ok) {
        throw new Error('Failed to generate OG image prompt')
      }

      const ogData = await ogResponse.json()
      setOgResult(ogData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            MOPerator SEO Optimizer
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Generate SEO metadata, structured schema, and OG images for the-moperator.com
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Inputs */}
          <div>
            <div className="rounded-lg border bg-card p-6">
              <SEOInputForm
                title={title}
                setTitle={setTitle}
                body={body}
                setBody={setBody}
                targetKeyword={targetKeyword}
                setTargetKeyword={setTargetKeyword}
                audiencePersona={audiencePersona}
                setAudiencePersona={setAudiencePersona}
                onSubmit={handleGenerate}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right Column - Outputs */}
          <div className="flex flex-col gap-6">
            <SEOMetadataCard
              metadata={
                seoResult
                  ? {
                      seoTitle: seoResult.seoTitle,
                      metaDescription: seoResult.metaDescription,
                      slug: seoResult.slug,
                      canonicalUrl: seoResult.canonicalUrl,
                      primaryKeyword: seoResult.primaryKeyword,
                      secondaryKeywords: seoResult.secondaryKeywords,
                    }
                  : null
              }
            />
            <SchemaCard schema={seoResult?.schema || null} />
            <OGPreviewCard ogData={ogResult} title={title} />
          </div>
        </div>
      </div>
    </main>
  )
}
