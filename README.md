# MOPerator SEO/AEO Optimizer

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/moperator-seo-aeo-optimizer&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20key%20for%20Claude%20AI&envLink=https://console.anthropic.com/settings/keys)

A tool for generating optimized SEO metadata, structured schema (JSON-LD), and OpenGraph image prompts for technical blogs. Built for [The MOPerator](https://the-moperator.com) but easily customizable for any site.

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

### Option A: Deploy to Vercel (Recommended for Non-Technical Users)

The easiest way to get started is deploying directly to Vercel with their AI Gateway integration.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/moperator-seo-aeo-optimizer&env=ANTHROPIC_API_KEY&envDescription=Your%20Anthropic%20API%20key%20for%20Claude%20AI&envLink=https://console.anthropic.com/settings/keys)

**Using Vercel AI Gateway (no API key management):**

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account and create the repository
3. In the Vercel dashboard, go to your project **Settings** > **AI Gateway**
4. Click **Enable AI Gateway** and connect to Anthropic
5. Vercel handles all API key management and billing for you

Learn more: [Vercel AI Gateway Documentation](https://vercel.com/docs/ai-gateway)

---

### Option B: Local Development

#### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- pnpm ([Install guide](https://pnpm.io/installation)) or npm
- Anthropic API key (see setup below)

#### Step 1: Get an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to **Settings** > **API Keys** ([direct link](https://console.anthropic.com/settings/keys))
4. Click **Create Key**
5. Give it a name (e.g., "SEO Optimizer") and copy the key
6. Store it securely - you won't be able to see it again

**Cost Estimate:** Each generation uses ~2,000-4,000 tokens, costing approximately $0.01-0.03 per use with Claude Sonnet.

#### Step 2: Install and Run

```bash
# Clone the repository
git clone https://github.com/yourusername/moperator-seo-aeo-optimizer.git
cd moperator-seo-aeo-optimizer

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

Open `.env.local` in a text editor and replace the placeholder with your actual API key:

```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

Then start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

---

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid API key" error | Double-check your key in `.env.local` starts with `sk-ant-` |
| "Rate limit exceeded" | Wait a few minutes or check your [Anthropic usage](https://console.anthropic.com/settings/usage) |
| Port 3000 in use | Run `pnpm dev -- -p 3001` to use a different port |
| Dependencies won't install | Try deleting `node_modules` and `pnpm-lock.yaml`, then run `pnpm install` again |

## Customization

All brand settings are centralized in **`lib/config.ts`**. Edit this single file to customize:

| Setting | Description |
|---------|-------------|
| `name`, `url`, `domain` | Your site's name and URL |
| `author` | Name and URL for schema attribution |
| `audience` | Target audience description for AI context |
| `colors` | Brand colors (background, primary, secondary, text) |
| `fonts` | Typography preferences |
| `tone` | Writing style guidelines and examples |
| `ogImage` | Visual style description for AI image generation |

Example: To rebrand for your site, update the config:

```typescript
export const siteConfig = {
  name: 'Your Blog Name',
  url: 'https://yourdomain.com',
  author: { name: 'Your Name', url: 'https://yourdomain.com' },
  colors: {
    primary: '#3b82f6',    // Your brand color
    secondary: '#60a5fa',
    // ...
  },
  // ...
}
```

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

MIT License - see [LICENSE](LICENSE) for details.
