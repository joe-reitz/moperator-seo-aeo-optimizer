# MOPerator SEO/AEO Optimizer

A specialized tool for generating optimized metadata, structured schema, and OpenGraph image prompts for [The MOPerator](https://the-moperator.com) technical blog.

## Features

### SEO Metadata Generation
- **SEO Title** - 50-60 character optimized titles
- **Meta Description** - 150-160 character search snippets
- **URL Slug** - Clean, URL-friendly paths
- **Canonical URL** - Properly formatted canonical links
- **Keywords** - Primary and secondary keyword extraction

### Answer Engine Optimization (AEO)
- **BlogPosting Schema** - JSON-LD structured data for search engines
- **FAQPage Schema** - Auto-generated FAQ markup when applicable
- **Speakable Elements** - Voice search optimization
- **Author/Publisher Attribution** - Proper entity markup

### OpenGraph Image Generation
- **Brand-Aligned Prompts** - Generates detailed prompts for AI image services
- **MOPerator Brand Themes** - Amber/gold accents, dark backgrounds, geometric patterns
- **Preview Mockup** - Visual preview of the final OG image layout

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **AI**: Vercel AI SDK with Claude Sonnet 4
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Anthropic API key

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/moperator-seo-aeo-optimizer.git
cd moperator-seo-aeo-optimizer

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

## Usage

1. **Enter Post Content**
   - Paste your blog post title and full markdown content
   - Optionally specify a target keyword and audience persona

2. **Generate Metadata**
   - Click "Generate SEO + OG" to process your content
   - AI analyzes your content and generates optimized metadata

3. **Copy Outputs**
   - SEO metadata for your CMS
   - JSON-LD schema to embed in your page
   - Image generation prompt for fal.ai, DALL-E, or similar services

## Brand Guidelines

The tool enforces The MOPerator's brand voice:
- Technical and professional tone
- No marketing fluff or hype language
- No emojis in generated content
- Direct, credible, substance-focused
- Targets Marketing Ops leaders, RevOps ICs, and technical founders

### Visual Brand Elements

- **Primary Background**: `#0c0c0f` (near-black)
- **Accent Color**: `#f59e0b` (amber)
- **Secondary Accent**: `#fbbf24` (gold)
- **Text Color**: `#e8e4dd` (warm white)
- **Fonts**: Space Grotesk (headings), JetBrains Mono (code)

## Project Structure

```
/app
  ├── page.tsx              # Main page with layout
  ├── layout.tsx            # Root layout with fonts
  └── /api
      ├── generate-seo/     # SEO metadata endpoint
      └── generate-og/      # OG image prompt endpoint

/components
  ├── seo-input-form.tsx    # Content input form
  ├── seo-metadata-card.tsx # SEO results display
  ├── schema-card.tsx       # JSON-LD schema display
  ├── og-preview-card.tsx   # OG image preview
  └── /ui                   # Radix UI components
```

## Future Enhancements

- [ ] Direct integration with image generation APIs (fal.ai, DALL-E)
- [ ] Download generated OG images as PNG
- [ ] Regenerate individual sections
- [ ] Save/load content drafts
- [ ] Batch processing for multiple posts

## License

Private - For MOPerator use only.
