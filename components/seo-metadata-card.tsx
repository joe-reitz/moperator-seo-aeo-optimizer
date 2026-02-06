'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface SEOMetadata {
  seoTitle: string
  metaDescription: string
  slug: string
  canonicalUrl: string
  primaryKeyword: string
  secondaryKeywords: string[]
  excerpt: string
}

interface SEOMetadataCardProps {
  metadata: SEOMetadata | null
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-muted-foreground hover:text-foreground transition-colors"
      title={`Copy ${label}`}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <CopyButton text={value} label={label} />
      </div>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  )
}

export function SEOMetadataCard({ metadata }: SEOMetadataCardProps) {
  if (!metadata) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">SEO Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Enter your post content and generate to see SEO metadata.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">SEO Metadata</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <MetadataRow label="SEO Title" value={metadata.seoTitle} />
        <MetadataRow label="Meta Description" value={metadata.metaDescription} />
        <MetadataRow label="Excerpt" value={metadata.excerpt} />
        <MetadataRow label="Slug" value={metadata.slug} />
        <MetadataRow label="Canonical URL" value={metadata.canonicalUrl} />
        <MetadataRow label="Primary Keyword" value={metadata.primaryKeyword} />
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Secondary Keywords
            </span>
            <CopyButton text={metadata.secondaryKeywords.join(', ')} label="Secondary Keywords" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {metadata.secondaryKeywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-secondary text-secondary-foreground"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
