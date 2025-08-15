## AI-Powered Product Listing Enhancer

### Overview
Create a small web app where a merchant can:
1) Upload a product image and enter minimal details (title, category, price)
2) Generate an AI‑suggested product description
3) Review/edit the suggestion before saving the listing

Clean, fast, componentized UI with a simple state flow and a small, well‑structured codebase.

### User Story
As a merchant, I want to upload a product and get a high‑quality description suggestion so I can publish faster with consistent tone and SEO keywords.

### MVP Scope
- **Product form & preview**
  - Inputs: title (text), category (select), price (number), image (upload/preview)
  - Live product card preview (title, price, image, description)
- **AI description**
  - Button: “Generate description” calls a text generation endpoint (real or mocked)
  - Show the suggestion, allow inline edit
- **Save**
  - “Save listing” stores the final object in memory (or local storage) and shows a confirmation/toast
  - Minimal “My Listings” view listing saved products (title + thumbnail)

### Non‑Functional Expectations
- **Snappy UX**: optimistic updates, loading/error/empty states
- **Clean architecture**: separation of concerns between form, preview, AI interaction, listings
- **Accessibility**: keyboard navigation for form/buttons; descriptive alt text for images

## Data Model
```json
{
  "id": "uuid",
  "title": "string",
  "category": "string",
  "price": 0,
  "imageUrl": "string",
  "description": "string",
  "meta": { "seoKeywords": ["string"], "language": "en" }
}
```

## AI API
- **Option A — Real AI API**: Call your preferred text generation API with product details.
- **Option B — Mock**: Expose `POST /api/generate-description` that returns a parameterized canned response.

### Example Contract (Mock)
Request:
```json
{
  "title": "Wireless Earbuds",
  "category": "Audio",
  "price": 59.99,
  "imageDataUrl": "data:image/png;base64,..."
}
```
Response:
```json
{
  "description": "Experience crystal‑clear audio with Bluetooth 5.3...",
  "meta": {
    "seoKeywords": ["wireless earbuds", "bluetooth", "noise cancelling"],
    "language": "en"
  }
}
```

## UX Details
- Image upload preview (data URL is fine)
- Generate button disabled while generating; show spinner
- Editable description after generation
- Preview card updates live as fields change
- Listings view uses in‑memory/local storage data

## Suggested Architecture
```
AI-Powered-Product-Listing-Enhancer/
  ├─ web/                      # Frontend SPA (e.g., React + TypeScript + Vite)
  │   ├─ src/
  │   │   ├─ components/
  │   │   │   ├─ ProductForm.tsx
  │   │   │   ├─ PreviewCard.tsx
  │   │   │   ├─ DescriptionEditor.tsx
  │   │   │   └─ ListingsView.tsx
  │   │   ├─ hooks/
  │   │   ├─ store/            # Local state + localStorage sync
  │   │   └─ api/              # Client calls to /api/generate-description
  │   └─ index.html
  └─ api/                      # Mock or real API
      └─ generate-description.(ts|js)
```

## Getting Started

### Prerequisites
- Node.js >= 18
- npm / pnpm / yarn

### Setup (illustrative)
```bash
git clone <YOUR_REPO_URL>
cd AI-Powered-Product-Listing-Enhancer
npm install
cp .env.example .env  # only needed if using a real AI provider
```

### Environment Variables (when using a real model)
- `OPENAI_API_KEY` or other provider key
- `MODEL_NAME` (e.g., `gpt-4o-mini`, `claude-3.5`, etc.)
- `TEMPERATURE`, `MAX_TOKENS` (optional)

### Run (illustrative)
```bash
# Start frontend and mock API
npm run dev

# Build
npm run build
```

## Accessibility Checklist
- All images have descriptive `alt` text
- Form controls have labels and keyboard focus styles
- Buttons are reachable and operable via keyboard
- Announce loading states and errors where applicable

## Quality
```bash
# Lint/format/tests (replace with actual project scripts)
npm run lint
npm run format
npm test
```

## Roadmap
- [ ] Real AI provider integration (swap the mock)
- [ ] SEO settings (tone presets, keyword controls)
- [ ] Batch uploads
- [ ] i18n (multi‑language UI and outputs)

## Contributing
1) Create a feature branch
2) Commit with clear messages
3) Add/adjust tests
4) Open a PR with context and screenshots for UI changes

## License
Specify your license (e.g., MIT).

## Acknowledgements
- Thanks to the AI/OSS communities that make rapid prototyping possible.

