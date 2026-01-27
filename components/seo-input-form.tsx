'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SEOInputFormProps {
  title: string
  setTitle: (value: string) => void
  body: string
  setBody: (value: string) => void
  targetKeyword: string
  setTargetKeyword: (value: string) => void
  audiencePersona: string
  setAudiencePersona: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function SEOInputForm({
  title,
  setTitle,
  body,
  setBody,
  targetKeyword,
  setTargetKeyword,
  audiencePersona,
  setAudiencePersona,
  onSubmit,
  isLoading,
}: SEOInputFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-foreground">
          Post Title
        </Label>
        <Input
          id="title"
          placeholder="How to Structure Campaign Objects in Salesforce"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body" className="text-foreground">
          Post Body
        </Label>
        <Textarea
          id="body"
          placeholder="Paste your blog post content here (markdown supported)..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-[300px] bg-background font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keyword" className="text-muted-foreground">
          Target Keyword <span className="text-xs">(optional)</span>
        </Label>
        <Input
          id="keyword"
          placeholder="salesforce campaign structure"
          value={targetKeyword}
          onChange={(e) => setTargetKeyword(e.target.value)}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="persona" className="text-muted-foreground">
          Audience Persona <span className="text-xs">(optional)</span>
        </Label>
        <Input
          id="persona"
          placeholder="Marketing Ops leader, RevOps IC, Founder"
          value={audiencePersona}
          onChange={(e) => setAudiencePersona(e.target.value)}
          className="bg-background"
        />
      </div>

      <Button
        onClick={onSubmit}
        disabled={isLoading || !title.trim() || !body.trim()}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate SEO + OG'
        )}
      </Button>
    </div>
  )
}
