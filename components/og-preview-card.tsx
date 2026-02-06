'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, Download } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { siteConfig } from '@/lib/config'

interface OGPreviewData {
  prompt: string
  imageUrl: string | null
  message?: string
}

interface OGPreviewCardProps {
  ogData: OGPreviewData | null
  title: string
}

export function OGPreviewCard({ ogData, title }: OGPreviewCardProps) {
  const [promptCopied, setPromptCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleCopyPrompt = async () => {
    if (!ogData?.prompt) return
    await navigator.clipboard.writeText(ogData.prompt)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

  const handleDownloadPNG = useCallback(async () => {
    if (!previewRef.current) return
    setDownloading(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(previewRef.current, {
        width: 1200,
        height: 630,
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      })
      const link = document.createElement('a')
      link.download = `${title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'og-image'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Failed to generate PNG:', err)
    } finally {
      setDownloading(false)
    }
  }, [title])

  if (!ogData) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">OpenGraph Image Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            OG image preview and prompt will appear here after generation.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">OpenGraph Image Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OG Image Preview Mockup - Brand Themed */}
        <div
          ref={previewRef}
          className="aspect-[1200/630] w-full rounded-lg relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${siteConfig.colors.background} 0%, ${siteConfig.colors.backgroundGradientEnd} 100%)` }}
        >
          {/* Grid texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `linear-gradient(${siteConfig.colors.primary}26 1px, transparent 1px), linear-gradient(90deg, ${siteConfig.colors.primary}26 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Geometric decorative elements */}
          <div
            className="absolute top-8 left-8 w-16 h-16 rounded-full opacity-[0.06]"
            style={{ border: `1px solid ${siteConfig.colors.primary}` }}
          />
          <div
            className="absolute bottom-12 right-24 w-24 h-24 rounded-full opacity-[0.04]"
            style={{ border: `1px solid ${siteConfig.colors.secondary}` }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Top badge with glow */}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: siteConfig.colors.primary,
                  boxShadow: `0 0 8px ${siteConfig.colors.primary}99`
                }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: siteConfig.colors.primary }}
              >
                {siteConfig.name}
              </span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h3
                className="text-xl font-semibold leading-tight line-clamp-3"
                style={{ color: siteConfig.colors.text }}
              >
                {title || 'Your Post Title'}
              </h3>
              <p className="text-sm" style={{ color: siteConfig.colors.textMuted }}>{siteConfig.domain}</p>
            </div>
          </div>

          {/* Decorative accent - primary glow */}
          <div
            className="absolute top-0 right-0 w-40 h-40"
            style={{
              background: `radial-gradient(circle at top right, ${siteConfig.colors.primary}26 0%, transparent 70%)`
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32"
            style={{
              background: `radial-gradient(circle at bottom left, ${siteConfig.colors.secondary}14 0%, transparent 70%)`
            }}
          />
        </div>

        {/* Download Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent"
          onClick={handleDownloadPNG}
          disabled={downloading}
        >
          <Download className="h-3.5 w-3.5" />
          {downloading ? 'Generating...' : 'Download PNG (1200x630)'}
        </Button>

        {/* Image Generation Prompt */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Image Generation Prompt
            </span>
            <Button variant="ghost" size="sm" onClick={handleCopyPrompt} className="h-7 px-2">
              {promptCopied ? (
                <>
                  <Check className="h-3 w-3" />
                  <span className="text-xs">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span className="text-xs">Copy</span>
                </>
              )}
            </Button>
          </div>
          <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground font-mono">
            {ogData.prompt}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
