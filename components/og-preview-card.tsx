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
        {/* OG Image Preview Mockup */}
        <div className="aspect-[1200/630] w-full rounded-lg bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden">
          {/* Grid texture overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
            }}
          />
          
          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Top badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                The MOPerator
              </span>
            </div>
            
            {/* Title */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white leading-tight line-clamp-3">
                {title || 'Your Post Title'}
              </h3>
              <p className="text-sm text-zinc-400">the-moperator.com</p>
            </div>
          </div>

          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-teal-500/20 to-transparent" />
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
