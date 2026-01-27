import { generateText } from 'ai'

export async function POST(req: Request) {
  const { title, description } = await req.json()

  // Generate a detailed prompt for the OG image
  const { text: imagePrompt } = await generateText({
    model: 'anthropic/claude-sonnet-4-20250514',
    system: `You are an expert at writing prompts for AI image generation. Create prompts for professional, technical blog OpenGraph images that match The MOPerator brand identity.

BRAND SPECIFICATIONS:
- Background: Deep charcoal/near-black (#0c0c0f to #1a1a22 gradient)
- Primary Accent: Amber/gold (#f59e0b) with glow effects
- Secondary Accent: Lighter gold (#fbbf24)
- Text Color: Warm off-white (#e8e4dd)
- Typography: Modern geometric sans-serif (Space Grotesk style)

VISUAL STYLE:
- Operator/terminal aesthetic with subtle tech grid patterns
- Geometric shapes (circles, rectangles) as decorative overlays at very low opacity
- Amber/gold glowing accents and highlights (similar to neon terminal styling)
- Professional, minimalist aesthetic similar to Vercel or Linear marketing
- No photographs of people
- No stock-art feeling
- Clean, geometric accents with subtle glow effects

LOGO INTEGRATION:
- The MOPerator logo features a geometric "M" mark made of overlapping angular shapes
- Logo uses amber (#f59e0b) and gold (#fbbf24) on white elements
- Place branding subtly in upper left or lower right
- Include "THE MOPERATOR" text badge`,
    messages: [
      {
        role: 'user',
        content: `Create a detailed image generation prompt for an OpenGraph image (1200x630) for a blog post titled: "${title}"

Description: ${description}

The image should incorporate The MOPerator brand identity with amber/gold accents on a dark background. Include subtle geometric patterns and the brand mark. Generate ONLY the prompt, nothing else.`,
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
