import { generateText, Output } from 'ai'
import { z } from 'zod'
import { siteConfig } from '@/lib/config'
import { getModel } from '@/lib/model'

const seoOutputSchema = z.object({
  seoTitle: z.string().describe('SEO-optimized title, 50-60 characters'),
  metaDescription: z.string().describe('Meta description, 150-160 characters'),
  slug: z.string().describe('URL-friendly slug derived from the title'),
  canonicalUrl: z.string().describe(`Full canonical URL using ${siteConfig.url}`),
  primaryKeyword: z.string().describe('Main keyword to target'),
  secondaryKeywords: z.array(z.string()).describe('3-5 secondary keywords'),
  schema: z.object({
    context: z.string(),
    type: z.string().describe('Use "TechArticle" for technical/how-to content, "BlogPosting" for opinion/commentary'),
    headline: z.string(),
    description: z.string(),
    abstract: z.string().describe('2-3 sentence summary that directly answers the core question of the article. AI search engines extract this as a featured answer.'),
    url: z.string().describe('Canonical URL of the article'),
    mainEntityOfPage: z.object({
      type: z.string(),
      id: z.string(),
    }).describe('Main entity reference, @type WebPage with @id as the canonical URL'),
    isPartOf: z.object({
      type: z.string(),
      name: z.string(),
      url: z.string(),
    }).describe('WebSite entity this article belongs to'),
    image: z.string().describe('OG image URL using the canonical URL + /og.png'),
    thumbnailUrl: z.string().describe('Thumbnail image URL, same as image'),
    wordCount: z.number().describe('Approximate word count of the article body'),
    isAccessibleForFree: z.boolean().describe('Always true for freely accessible content'),
    author: z.object({
      type: z.string(),
      name: z.string(),
      url: z.string(),
      sameAs: z.array(z.string()).describe('Author social profile URLs (LinkedIn, Twitter/X, GitHub)'),
    }),
    publisher: z.object({
      type: z.string(),
      name: z.string(),
      url: z.string(),
      logo: z.object({
        type: z.string(),
        url: z.string(),
      }).describe('Publisher logo, use @type ImageObject with URL to site logo'),
    }),
    datePublished: z.string(),
    dateModified: z.string(),
    keywords: z.array(z.string()),
    articleSection: z.string(),
    inLanguage: z.string(),
    about: z.array(z.object({
      type: z.string().describe('@type: use "DefinedTerm" for technical concepts, "Thing" for general topics'),
      name: z.string(),
      description: z.string().describe('Brief 1-sentence description of the concept'),
      sameAs: z.string().optional().describe('Wikipedia or authoritative URL for the concept, if applicable'),
    })).describe('3-5 key concepts/entities the article is about, as structured DefinedTerm objects'),
    mentions: z.array(z.object({
      type: z.string().describe('@type: "Thing", "Organization", "SoftwareApplication", etc.'),
      name: z.string(),
      sameAs: z.string().optional().describe('Wikipedia or product URL for the entity'),
    })).describe('Named entities (tools, platforms, companies, standards) referenced in the article'),
    audience: z.object({
      type: z.string(),
      audienceType: z.string(),
    }),
    speakable: z.object({
      type: z.string(),
      cssSelector: z.array(z.string()),
    }),
    hasPart: z.array(z.object({
      type: z.string().describe('@type: "WebPageElement"'),
      name: z.string().describe('Section heading'),
      cssSelector: z.string().describe('CSS selector for the section, e.g. "#section-slug"'),
    })).describe('Major sections of the article for AI to understand content structure'),
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
    }).nullable().describe('FAQPage schema if the content naturally supports 2-4 FAQ questions'),
    howTo: z.object({
      context: z.string(),
      type: z.string(),
      name: z.string(),
      description: z.string(),
      step: z.array(z.object({
        type: z.string(),
        name: z.string(),
        text: z.string(),
      })),
    }).nullable().describe('HowTo schema ONLY if the content is instructional with clear sequential steps'),
  }),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, body: postBody, targetKeyword, audiencePersona } = body

    if (!title?.trim() || !postBody?.trim()) {
      return Response.json(
        { error: 'Title and body are required' },
        { status: 400 }
      )
    }

    const systemPrompt = `You are an expert SEO and AEO (Answer Engine Optimization) specialist for ${siteConfig.description} called "${siteConfig.name}" (${siteConfig.url}).

Your task is to generate comprehensive SEO metadata and structured schema that ranks in BOTH traditional search engines AND AI search engines (Perplexity, ChatGPT Search, Google AI Overviews).

CRITICAL TONE REQUIREMENTS:
- ${siteConfig.tone.description}
- Avoid: ${siteConfig.tone.avoid.join(', ')}

GOOD EXAMPLE: "${siteConfig.tone.goodExample}"
BAD EXAMPLE: "${siteConfig.tone.badExample}"

The audience is primarily ${siteConfig.audience.description}.

Generate content that optimizes for:
1. Google SEO - rich results, featured snippets, knowledge panels
2. AEO (Answer Engine Optimization) - AI assistants extracting direct answers
3. Social preview optimization - X, LinkedIn, Slack unfurls
4. Voice search - speakable structured data
5. E-E-A-T signals - author expertise, entity disambiguation

SCHEMA REQUIREMENTS:
- Use "https://schema.org" as the @context
- Use "TechArticle" as @type for technical/how-to content, "BlogPosting" for commentary/opinion
- Author: "${siteConfig.author.name}" with url "${siteConfig.author.url}"
- Publisher: "${siteConfig.publisher.name}" organization with url "${siteConfig.publisher.url}"
- Publisher logo: "${siteConfig.url}/logo.png" as ImageObject
- isPartOf: WebSite with name "${siteConfig.name}" and url "${siteConfig.url}"
- isAccessibleForFree: always true

AEO-SPECIFIC REQUIREMENTS:
- "abstract" MUST be a 2-3 sentence summary that directly answers the core question. AI search engines use this as their primary extraction point. Write it as if answering "What is this article about and what does it conclude?"
- "about" should be DefinedTerm objects with descriptions and sameAs links to Wikipedia or authoritative sources where applicable
- "mentions" should capture every tool, platform, company, or standard referenced (e.g., Salesforce, HubSpot, Marketo, GA4)
- "hasPart" should break the article into its major sections for AI content structure understanding
- Include HowTo schema ONLY for genuinely instructional content with clear steps
- Include FAQPage schema ONLY if the content naturally supports 2-4 FAQ questions
- Use today's date for datePublished and dateModified

Be concise and technical in all generated text.`

    const userPrompt = `Generate comprehensive SEO + AEO metadata and schema for this blog post:

TITLE: ${title}

BODY:
${postBody}

${targetKeyword ? `TARGET KEYWORD: ${targetKeyword}` : ''}
${audiencePersona ? `AUDIENCE PERSONA: ${audiencePersona}` : `AUDIENCE PERSONA: ${siteConfig.audience.defaultPersona}`}`

    const { output } = await generateText({
      model: getModel(),
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
      maxOutputTokens: 8000,
      temperature: 0.3,
    })

    return Response.json({ seo: output })
  } catch (error) {
    console.error('SEO generation error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate SEO metadata'
    return Response.json({ error: message }, { status: 500 })
  }
}
