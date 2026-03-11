# AIIInterior

An AI-powered interior designer web app where users can upload a room photo and generate several redesign concepts in different styles.

## Features

- Upload a room image.
- Enter multiple design styles (comma-separated).
- Generate a selection of AI design alternatives.
- Returns photorealistic style variants using OpenAI (`gpt-image-1`) when configured.
- Graceful fallback demo mode when `OPENAI_API_KEY` is not configured.

## Tech stack

- Node.js built-in HTTP server backend (no external runtime dependencies)
- Vanilla HTML/CSS/JS frontend
- OpenAI Images API

## Quickstart

1. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Set:

   ```bash
   OPENAI_API_KEY=your_key_here
   PORT=3000
   ```

2. Start the app:

   ```bash
   npm run dev
   ```

3. Open:

   ```
   http://localhost:3000
   ```

## API

### `POST /api/designs`

JSON body fields:

- `roomImageDataUrl` (string, required, e.g. `data:image/jpeg;base64,...`)
- `styles` (string, optional, default: `Modern, Scandinavian, Minimalist`)
- `numDesigns` (number, optional, default: `3`, max: `6`)

Returns:

```json
{
  "designs": [
    {
      "style": "Modern",
      "prompt": "...",
      "imageUrl": "data:image/png;base64,..."
    }
  ]
}
```

## Notes for production

- Add user auth and project history storage.
- Add rate limiting and file size limits.
- Move image storage to object storage.
- Add moderation and safety filters.
