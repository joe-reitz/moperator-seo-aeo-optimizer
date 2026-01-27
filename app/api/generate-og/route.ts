import { generateText } from 'ai'

export async function POST(req: Request) {
  const { title, description } = await req.json()

  // Generate a detailed prompt for the OG image
  const { text: imagePrompt } = await generateText({
    model: 'anthropic/claude-sonnet-4-20250514',
    system: `You are an expert at writing prompts for AI image generation. Create prompts for professional, technical blog OpenGraph images.

The style should be:
- Dark background (deep charcoal or near-black)
- Strong typographic hierarchy with the title prominent
- Subtle technical grid or circuit-like texture in the background
- Professional, minimalist aesthetic similar to Vercel or Linear marketing
- No photographs of people
- No stock-art feeling
- Clean, geometric accents
- Brand colors can include subtle teal/cyan accents against the dark background`,
    messages: [
      {
        role: 'user',
        content: `Create a detailed image generation prompt for an OpenGraph image (1200x630) for a blog post titled: "${title}"

Description: ${description}

The image should feature "The MOPerator" branding subtly. Generate ONLY the prompt, nothing else.`,
      },
    ],
    maxOutputTokens: 500,
    temperature: 0.7,
  })

  // For now, we'll return the prompt and a placeholder
  // In production, this would call an image generation API like fal.ai or DALL-E
  return Response.json({ 
    prompt: imagePrompt,
    imageUrl: null, // Would contain generated image URL
    message: 'Image prompt generated. Connect an image generation service (fal.ai, DALL-E) to generate the actual image.'
  })
}
