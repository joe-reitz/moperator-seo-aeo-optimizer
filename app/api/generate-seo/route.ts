import { generateText, Output } from 'ai'
import { z } from 'zod'

const seoOutputSchema = z.object({
  seoTitle: z.string().describe('SEO-optimized title, 50-60 characters'),
  metaDescription: z.string().describe('Meta description, 150-160 characters'),
  slug: z.string().describe('URL-friendly slug derived from the title'),
  canonicalUrl: z.string().describe('Full canonical URL using https://the-moperator.com'),
  primaryKeyword: z.string().describe('Main keyword to target'),
  secondaryKeywords: z.array(z.string()).describe('3-5 secondary keywords'),
  schema: z.object({
    context: z.string(),
    type: z.string(),
    headline: z.string(),
    description: z.string(),
    author: z.object({
      type: z.string(),
      name: z.string(),
      url: z.string(),
    }),
    publisher: z.object({
      type: z.string(),
      name: z.string(),
      url: z.string(),
    }),
    datePublished: z.string(),
    dateModified: z.string(),
    keywords: z.array(z.string()),
    articleSection: z.string(),
    inLanguage: z.string(),
    about: z.array(z.string()),
    audience: z.object({
      type: z.string(),
      audienceType: z.string(),
    }),
    speakable: z.object({
      type: z.string(),
      cssSelector: z.array(z.string()),
    }),
    faqPage: z.object({
      context: z.string(),
      type: z.string(),
      mainEntity: z.array(z.object({
        type: z.string(),
        name: z.string(),
        acceptedAnswer: z.object({
          type: z.string(),
          text: z.string(),
        }),
      })),
    }).nullable().describe('FAQPage schema if the content supports FAQ questions'),
  }),
})

export async function POST(req: Request) {
  const { title, body, targetKeyword, audiencePersona } = await req.json()

  const systemPrompt = `You are an expert SEO specialist for a technical Marketing Operations and RevOps blog called "The MOPerator" (https://the-moperator.com).

Your task is to generate SEO metadata and structured schema for blog posts.

CRITICAL TONE REQUIREMENTS:
- No marketing fluff or hype language
- No emojis ever
- Direct, technical, and credible
- Written for smart operators who value substance

GOOD EXAMPLE: "This post explains how to structure campaign objects in Salesforce to avoid downstream attribution failure."
BAD EXAMPLE: "Boost your marketing with this amazing guide!"

The audience is primarily Marketing Ops leaders, RevOps ICs, and technical founders who work with marketing automation, CRM systems, and data operations.

Generate content that optimizes for:
1. Google SEO best practices
2. AEO (Answer Engine Optimization) for AI assistants
3. Social preview optimization (X, LinkedIn, Slack)

For the schema:
- Use "https://schema.org" as the @context
- Use "BlogPosting" as the primary @type
- Author should be "Joe Reitz" with url "https://the-moperator.com"
- Publisher should be "The MOPerator" organization
- Include FAQPage schema ONLY if the content naturally supports 2-4 FAQ questions
- Use today's date for datePublished and dateModified

Be concise and technical in all generated text.`

  const userPrompt = `Generate SEO metadata and schema for this blog post:

TITLE: ${title}

BODY:
${body}

${targetKeyword ? `TARGET KEYWORD: ${targetKeyword}` : ''}
${audiencePersona ? `AUDIENCE PERSONA: ${audiencePersona}` : 'AUDIENCE PERSONA: Marketing Operations Professional'}`

  const { output } = await generateText({
    model: 'anthropic/claude-sonnet-4-20250514',
    output: Output.object({
      schema: seoOutputSchema,
    }),
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    maxOutputTokens: 4000,
    temperature: 0.3,
  })

  return Response.json({ seo: output })
}
