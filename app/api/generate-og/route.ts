import { generateText } from 'ai'
import { siteConfig } from '@/lib/config'
import { getModel } from '@/lib/model'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description } = body

    if (!title?.trim()) {
      return Response.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const { text: imagePrompt } = await generateText({
      model: getModel(),
      system: `You are an expert at writing prompts for AI image generation. Create prompts for professional, technical blog OpenGraph images that match the ${siteConfig.name} brand identity.

BRAND SPECIFICATIONS:
- Background: Deep charcoal/near-black (${siteConfig.colors.background} to ${siteConfig.colors.backgroundGradientEnd} gradient)
- Primary Accent: ${siteConfig.colors.primary} with glow effects
- Secondary Accent: ${siteConfig.colors.secondary}
- Text Color: ${siteConfig.colors.text}
- Typography: Modern geometric sans-serif (${siteConfig.fonts.heading} style)

VISUAL STYLE:
${siteConfig.ogImage.style}

LOGO INTEGRATION:
${siteConfig.ogImage.logoDescription}`,
      messages: [
        {
          role: 'user',
          content: `Create a detailed image generation prompt for an OpenGraph image (1200x630) for a blog post titled: "${title}"

Description: ${description || title}

The image should incorporate the ${siteConfig.name} brand identity with accents on a dark background. Include subtle geometric patterns and the brand mark. Generate ONLY the prompt, nothing else.`,
        },
      ],
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    return Response.json({
      prompt: imagePrompt,
      imageUrl: null,
      message: 'Image prompt generated. Connect an image generation service (fal.ai, DALL-E) to generate the actual image.'
    })
  } catch (error) {
    console.error('OG generation error:', error)
    const message = error instanceof Error ? error.message : 'Failed to generate OG image prompt'
    return Response.json({ error: message }, { status: 500 })
  }
}
