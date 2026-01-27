'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check, Download, ImageIcon } from 'lucide-react'
import { useState } from 'react'

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

  const handleCopyPrompt = async () => {
    if (!ogData?.prompt) return
    await navigator.clipboard.writeText(ogData.prompt)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 2000)
  }

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
        {/* OG Image Preview Mockup - MOPerator Brand */}
        <div
          className="aspect-[1200/630] w-full rounded-lg relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0c0c0f 0%, #1a1a22 100%)' }}
        >
          {/* Grid texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `linear-gradient(rgba(245,158,11,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.15) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Geometric decorative elements */}
          <div
            className="absolute top-8 left-8 w-16 h-16 rounded-full opacity-[0.06]"
            style={{ border: '1px solid #f59e0b' }}
          />
          <div
            className="absolute bottom-12 right-24 w-24 h-24 rounded-full opacity-[0.04]"
            style={{ border: '1px solid #fbbf24' }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Top badge with glow */}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: '#f59e0b',
                  boxShadow: '0 0 8px rgba(245, 158, 11, 0.6)'
                }}
              />
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#f59e0b' }}
              >
                The MOPerator
              </span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h3
                className="text-xl font-semibold leading-tight line-clamp-3"
                style={{ color: '#e8e4dd' }}
              >
                {title || 'Your Post Title'}
              </h3>
              <p className="text-sm" style={{ color: '#6b7280' }}>the-moperator.com</p>
            </div>
          </div>

          {/* Decorative accent - amber glow */}
          <div
            className="absolute top-0 right-0 w-40 h-40"
            style={{
              background: 'radial-gradient(circle at top right, rgba(245, 158, 11, 0.15) 0%, transparent 70%)'
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32"
            style={{
              background: 'radial-gradient(circle at bottom left, rgba(251, 191, 36, 0.08) 0%, transparent 70%)'
            }}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Preview mockup. Connect an image generation service to create the actual OG image.
        </p>

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

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="flex-1 bg-transparent">
            <Download className="h-3.5 w-3.5" />
            Download PNG
          </Button>
          <Button variant="outline" size="sm" disabled className="flex-1 bg-transparent">
            <ImageIcon className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          Image generation requires fal.ai or similar service integration
        </p>
      </CardContent>
    </Card>
  )
}
