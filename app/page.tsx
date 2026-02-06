'use client'

import { useState, useEffect, useCallback } from 'react'
import { SEOInputForm } from '@/components/seo-input-form'
import { SEOMetadataCard } from '@/components/seo-metadata-card'
import { SchemaCard } from '@/components/schema-card'
import { OGPreviewCard } from '@/components/og-preview-card'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { useLocalStorageDraft } from '@/hooks/use-local-storage-draft'
import { useGenerationHistory } from '@/hooks/use-generation-history'
import { ThemeToggle } from '@/components/theme-toggle'
import { siteConfig } from '@/lib/config'

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

  const { saveDraft, loadDraft, clearDraft, isHydrated } = useLocalStorageDraft()
  const { addToHistory, history, clearHistory } = useGenerationHistory()

  // Restore draft on mount
  useEffect(() => {
    if (!isHydrated) return
    const draft = loadDraft()
    if (draft) {
      setTitle(draft.title)
      setBody(draft.body)
      setTargetKeyword(draft.targetKeyword)
      setAudiencePersona(draft.audiencePersona)
    }
  }, [isHydrated, loadDraft])

  // Auto-save draft on changes (debounced via effect)
  useEffect(() => {
    if (!isHydrated) return
    if (!title && !body) return
    const timer = setTimeout(() => {
      saveDraft({ title, body, targetKeyword, audiencePersona })
    }, 1000)
    return () => clearTimeout(timer)
  }, [title, body, targetKeyword, audiencePersona, saveDraft, isHydrated])

  const handleGenerate = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Fire both API calls in parallel
      const [seoResponse, ogResponse] = await Promise.all([
        fetch('/api/generate-seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, body, targetKeyword, audiencePersona }),
        }),
        fetch('/api/generate-og', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description: '' }),
        }),
      ])

      if (!seoResponse.ok) {
        const errData = await seoResponse.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to generate SEO metadata')
      }

      const seoData = await seoResponse.json()
      setSeoResult(seoData.seo)

      if (!ogResponse.ok) {
        const errData = await ogResponse.json().catch(() => ({}))
        throw new Error(errData.error || 'Failed to generate OG image prompt')
      }

      const ogData = await ogResponse.json()
      setOgResult(ogData)

      // Save to history
      if (seoData.seo) {
        addToHistory({
          title,
          seoTitle: seoData.seo.seoTitle,
          metaDescription: seoData.seo.metaDescription,
          slug: seoData.seo.slug,
          ogPrompt: ogData.prompt || '',
        })
      }

      // Clear draft after successful generation
      clearDraft()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [title, body, targetKeyword, audiencePersona, addToHistory, clearDraft])

  const canGenerate = !isLoading && title.trim().length > 0 && body.trim().length > 0

  // Cmd/Ctrl + Enter keyboard shortcut
  useKeyboardShortcuts({ onGenerate: handleGenerate, canGenerate })

  const handleLoadFromHistory = useCallback((item: typeof history[number]) => {
    setTitle(item.title)
    setSeoResult(null)
    setOgResult(null)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {siteConfig.name} SEO Optimizer
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Generate SEO metadata, structured schema, and OG images for {siteConfig.domain}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <span className="hidden sm:block text-xs text-muted-foreground">
                {history.length} generation{history.length !== 1 ? 's' : ''} saved
              </span>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* History Bar */}
        {history.length > 0 && (
          <div className="mb-6 rounded-lg border bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Recent Generations
              </span>
              <button
                onClick={clearHistory}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {history.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLoadFromHistory(item)}
                  className="shrink-0 rounded-md border bg-background px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors max-w-[200px] truncate"
                  title={item.title}
                >
                  {item.title}
                </button>
              ))}
            </div>
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
