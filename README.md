# n8n-nodes-headless-saas-infographics

An n8n community node for [Headless SaaS](https://headless-sass-bzzrfsh6ra-el.a.run.app) — generate infographics, comics, cover images, social carousels, and slide decks directly inside your n8n workflows using your API key.

---

## What this node does

The **Headless SaaS** node lets you call the Headless SaaS image generation API directly from n8n. Choose from five generation types, configure style and layout options, and receive ready-to-use image URL(s) along with your remaining credit balance.

### Supported operations

| Operation | Skill | Returns |
|---|---|---|
| Infographic | `baoyu-infographic` | Single image URL |
| Comic | `baoyu-comic` | Single image URL |
| Cover Image | `baoyu-cover-image` | Single image URL |
| XHS / Social Carousel | `baoyu-xhs-images` | Array of image URLs |
| Slide Deck | `baoyu-slide-deck` | Array of image URLs |

---

## Installation

### Community node (recommended)

In your n8n instance, go to **Settings → Community Nodes → Install** and enter:

```
@itechnotion/n8n-nodes-headless-saas-infographics
```

### Manual (npm)

```bash
npm install @itechnotion/n8n-nodes-headless-saas-infographics
```

Or with pnpm:

```bash
pnpm add @itechnotion/n8n-nodes-headless-saas-infographics
```

---

## Getting an API key

1. Sign in to the [Headless SaaS dashboard](https://headless-sass-bzzrfsh6ra-el.a.run.app).
2. Navigate to **API Keys** in the sidebar.
3. Click **Generate Key** — your key will start with `pxl_live_`.
4. Copy the key and store it somewhere safe (it won't be shown again).

---

## Credentials setup

1. In n8n, open **Credentials → New Credential**.
2. Search for **Headless SaaS API**.
3. Paste your `pxl_live_...` key into the **API Key** field.
4. Click **Save** — n8n will test the credential automatically.

---

## Operations reference

---

### 1. Infographic (`baoyu-infographic`)

Automatically condenses textual content into highly scannable, visually structured maps and dashboards.

- **Returns:** `imageUrl` (Single Image)

```json
{
  "skill": "baoyu-infographic",
  "content": "Your markdown or body text...",
  "user": "optional_user_tracking_label",
  "options": {
    "language": "en",
    "layout": "bento-grid",
    "style": "retro-pop-grid"
  }
}
```

#### Available `layout` options

| | | | |
|---|---|---|---|
| `bento-grid` | `binary-comparison` | `bridge` | `circular-flow` |
| `comic-strip` | `comparison-matrix` | `dashboard` | `dense-modules` |
| `funnel` | `hierarchical-layers` | `hub-spoke` | `iceberg` |
| `isometric-map` | `jigsaw` | `linear-progression` | `periodic-table` |
| `story-mountain` | `structural-breakdown` | `tree-branching` | `venn-diagram` |
| `winding-roadmap` | | | |

#### Available `style` options

| | | | |
|---|---|---|---|
| `aged-academia` | `bold-graphic` | `chalkboard` | `claymation` |
| `corporate-memphis` | `craft-handmade` | `cyberpunk-neon` | `ikea-manual` |
| `kawaii` | `knolling` | `lego-brick` | `morandi-journal` |
| `origami` | `pixel-art` | `pop-laboratory` | `retro-pop-grid` |
| `storybook-watercolor` | `subway-map` | `technical-schematic` | `ui-wireframe` |

---

### 2. Comic (`baoyu-comic`)

Converts any story or educational content into a hand-drawn knowledge comic panel.

- **Returns:** `imageUrl` (Single Image)

```json
{
  "skill": "baoyu-comic",
  "content": "Story content...",
  "options": {
    "language": "en",
    "art": "ligne-claire",
    "tone": "dramatic",
    "layout": "splash",
    "aspectRatio": "3:4"
  }
}
```

> **`aspectRatio` options:** `3:4`, `4:3`, `16:9`, `1:1`

#### Available `art` (Art Styles)

`chalk` · `ink-brush` · `ligne-claire` · `manga` · `realistic`

#### Available `tone` (Emotional Tones)

`action` · `dramatic` · `energetic` · `neutral` · `romantic` · `vintage` · `warm`

#### Available `layout` (Panel Layouts)

`cinematic` · `dense` · `mixed` · `splash` · `standard` · `webtoon`

---

### 3. Cover Image (`baoyu-cover-image`)

Generates a hero/cover image optimised for a blog post or landing page header.

- **Returns:** `imageUrl` (Single Image)

```json
{
  "skill": "baoyu-cover-image",
  "content": "Article body...",
  "options": {
    "language": "en",
    "type": "hero",
    "palette": "cool",
    "rendering": "flat-vector",
    "mood": "balanced",
    "textDensity": "title-subtitle",
    "aspectRatio": "16:9"
  }
}
```

> **`mood` options:** `subtle`, `balanced`, `bold`  
> **`textDensity` options:** `none`, `title-only`, `title-subtitle`, `text-rich`  
> **`aspectRatio` options:** `16:9`, `4:3`, `1:1`, `9:16`

#### Available `type` (Layout Types)

`hero` · `conceptual` · `typography` · `metaphor` · `scene` · `minimal`

#### Available `palette` (Color Palettes)

`cool` · `dark` · `earth` · `elegant` · `mono` · `pastel` · `retro` · `vivid` · `warm`

#### Available `rendering` (Visual Style)

`chalk` · `digital` · `flat-vector` · `hand-drawn` · `painterly` · `pixel`

---

### 4. XHS / Social Carousel (`baoyu-xhs-images`)

Generates an array of engaging, vertical carousel pages optimised for modern social media.

- **Returns:** `imageUrls` (Array of Images)

```json
{
  "skill": "baoyu-xhs-images",
  "content": "Content to transform into swipeable carousel...",
  "options": {
    "language": "en",
    "style": "notion",
    "layout": "canvas",
    "aspectRatio": "3:4"
  }
}
```

> **`aspectRatio` options:** `3:4`, `4:3`, `1:1`, `9:16`

#### Available `style` (Visual Presets)

`bold` · `chalkboard` · `cute` · `fresh` · `minimal` · `notion` · `pop` · `retro` · `study-notes` · `warm`

#### Available `layout` (Information Hierarchy)

`canvas` · `decorations` · `image-effects` · `typography`

---

### 5. Slide Deck (`baoyu-slide-deck`)

Automatically generates a complete business presentation deck composed of multiple distinct slides.

- **Returns:** `imageUrls` (Array of Images)

```json
{
  "skill": "baoyu-slide-deck",
  "content": "Quarterly overview bullet points...",
  "options": {
    "language": "en",
    "style": "corporate",
    "aspectRatio": "16:9"
  }
}
```

> **`aspectRatio` options:** `16:9`, `4:3`, `1:1`

#### Available `style` (Presentation Designs)

| | | | |
|---|---|---|---|
| `blueprint` | `bold-editorial` | `chalkboard` | `corporate` |
| `dark-atmospheric` | `editorial-infographic` | `fantasy-animation` | `intuition-machine` |
| `minimal` | `notion` | `pixel-art` | `scientific` |
| `sketch-notes` | `vector-illustration` | `vintage` | `watercolor` |

---

## Intelligent Auto-Selection (AI Director)

If you are unsure which `style`, `palette`, or `layout` to use, simply **omit those keys** from your `options` object. The API will automatically run a preliminary Gemini Agent query to intelligently scan all available options and pick the best stylistic combination based on your content.

---

## Node output fields

| Field | Description |
|---|---|
| `success` | `true` if generation succeeded |
| `operation` | The operation used (e.g. `infographic`) |
| `skill` | The skill string passed to the API |
| `imageUrls` | Array of all generated image URLs |
| `firstImageUrl` | Shortcut to the first image URL |
| `imageUrl` | Alias for the first image URL (single-image operations) |
| `creditsRemaining` | Credits remaining after this call |

**Cost:** 1 credit per call.

---

## Example workflow

```
[Manual Trigger]
      ↓
[Set node]
  content = "A comparison of top 5 programming languages in 2025"
      ↓
[Headless SaaS — Infographic]
  Layout: bento-grid
  Style:  bold-graphic
      ↓
[Send Email / HTTP Request — use firstImageUrl]
```

1. Add a **Manual Trigger** node.
2. Add a **Set** node to define your `content` (or pass it from a previous step).
3. Add the **Headless SaaS** node, select an operation, configure style options, and connect your credential.
4. Run the workflow — the output will contain `firstImageUrl` (or `imageUrls` for multi-image operations) ready to use downstream.

---

## Error handling

| HTTP status | Meaning |
|---|---|
| `401` | Invalid or missing API key |
| `402` | Insufficient credits — top up your pack |
| `400` | Missing `skill` or `content` field |
| `502` | Generation failed upstream — retry |
| `503` | Service temporarily unavailable |

Enable **Continue On Fail** on the node to handle errors gracefully in your workflow.

---

## Supported languages

| Code | Language |
|---|---|
| `en` | English |
| `zh` | Chinese |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `ja` | Japanese |
| `ko` | Korean |
| `pt` | Portuguese |

---

## Local development

```bash
# Build the node
pnpm run build

# Link into your local n8n custom nodes directory
mkdir -p ~/.n8n/custom
cd ~/.n8n/custom
npm install /absolute/path/to/n8n-nodes-headless-saas-infographics

# Start n8n
n8n start
```

Then search for **Headless SaaS** in the node panel.

---

## License

MIT © [Avkash Kakdia](mailto:avkash@itechnotion.com)