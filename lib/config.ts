/**
 * Site Configuration
 *
 * Customize these values to match your brand and site.
 * This is the ONLY file you need to edit to personalize the SEO optimizer.
 */

export const siteConfig = {
  // ============================================
  // SITE INFORMATION
  // ============================================
  name: 'The MOPerator',
  url: 'https://the-moperator.com',
  domain: 'the-moperator.com',
  description: 'A technical Marketing Operations and RevOps blog',

  // ============================================
  // AUTHOR / PUBLISHER
  // ============================================
  author: {
    name: 'Joe Reitz',
    url: 'https://the-moperator.com',
  },
  publisher: {
    name: 'The MOPerator',
    url: 'https://the-moperator.com',
  },

  // ============================================
  // TARGET AUDIENCE
  // ============================================
  audience: {
    description: 'Marketing Ops leaders, RevOps ICs, and technical founders',
    defaultPersona: 'Marketing Operations Professional',
  },

  // ============================================
  // BRAND COLORS
  // ============================================
  colors: {
    // Primary background (dark theme)
    background: '#0c0c0f',
    backgroundGradientEnd: '#1a1a22',

    // Accent colors
    primary: '#f59e0b',      // Amber
    secondary: '#fbbf24',    // Gold

    // Text colors
    text: '#e8e4dd',         // Warm off-white
    textMuted: '#6b7280',    // Gray
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================
  fonts: {
    heading: 'Space Grotesk',
    body: 'Space Grotesk',
    mono: 'JetBrains Mono',
  },

  // ============================================
  // CONTENT TONE & STYLE
  // ============================================
  tone: {
    // What your brand voice sounds like
    description: 'Technical and professional tone. Direct, credible, substance-focused.',

    // Things to AVOID in generated content
    avoid: [
      'marketing fluff or hype language',
      'emojis',
      'exclamation points',
      'words like "amazing", "incredible", "revolutionary"',
    ],

    // Good example of your tone
    goodExample: 'This post explains how to structure campaign objects in Salesforce to avoid downstream attribution failure.',

    // Bad example (what to avoid)
    badExample: 'Boost your marketing with this amazing guide!',
  },

  // ============================================
  // OG IMAGE VISUAL STYLE
  // ============================================
  ogImage: {
    // Visual aesthetic description for AI image generation
    style: `
      - Operator/terminal aesthetic with subtle tech grid patterns
      - Geometric shapes (circles, rectangles) as decorative overlays at very low opacity
      - Amber/gold glowing accents and highlights (similar to neon terminal styling)
      - Professional, minimalist aesthetic similar to Vercel or Linear marketing
      - No photographs of people
      - No stock-art feeling
      - Clean, geometric accents with subtle glow effects
    `.trim(),

    // Logo description for AI image generation
    logoDescription: `
      - The MOPerator logo features a geometric "M" mark made of overlapping angular shapes
      - Logo uses amber (#f59e0b) and gold (#fbbf24) on white elements
      - Place branding subtly in upper left or lower right
      - Include "THE MOPERATOR" text badge
    `.trim(),
  },

  // ============================================
  // AI MODEL
  // ============================================
  model: {
    id: 'claude-sonnet-4-20250514' as const,
  },
}

// Type export for TypeScript users
export type SiteConfig = typeof siteConfig
