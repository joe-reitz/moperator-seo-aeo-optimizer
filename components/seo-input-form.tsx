'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Command } from 'lucide-react'
import dynamic from 'next/dynamic'

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  loading: () => <div className="min-h-[300px] rounded-md border bg-background p-4 text-muted-foreground text-sm">Loading preview...</div>,
})

const WORD_SPLIT_RE = /\s+/

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

function CharacterCount({ current, min, max }: { current: number; min: number; max: number }) {
  const isUnder = current < min
  const isOver = current > max
  const isOptimal = current >= min && current <= max

  return (
    <span className={`text-xs ${isOptimal ? 'text-green-500' : isUnder ? 'text-muted-foreground' : 'text-amber-500'}`}>
      {current}/{max} chars
      {isOptimal && ' (optimal)'}
      {isOver && ' (too long)'}
    </span>
  )
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
  const canSubmit = !isLoading && title.trim().length > 0 && body.trim().length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="title" className="text-foreground">
            Post Title
          </Label>
          <CharacterCount current={title.length} min={30} max={70} />
        </div>
        <Input
          id="title"
          placeholder="How to Structure Campaign Objects in Salesforce"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="body" className="text-foreground">
            Post Body
          </Label>
          <span className="text-xs text-muted-foreground">
            {body.split(WORD_SPLIT_RE).filter(Boolean).length} words
          </span>
        </div>
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="write" className="text-xs">Write</TabsTrigger>
            <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="mt-2">
            <Textarea
              id="body"
              placeholder="Paste your blog post content here (markdown supported)..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[300px] bg-background font-mono text-sm"
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-2">
            <div className="min-h-[300px] rounded-md border bg-background p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto">
              {body ? (
                <ReactMarkdown>{body}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic">Nothing to preview yet...</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
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

      <div className="space-y-2">
        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
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
        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
          <Command className="h-3 w-3" />
          <span>+ Enter to generate</span>
        </p>
      </div>
    </div>
  )
}
