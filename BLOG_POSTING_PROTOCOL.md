# Blog Posting Protocol — Indications Media

## Endpoint

```
POST https://indicationsmedia.com/api/posts
```

## Authentication

```
Authorization: Bearer Fraser1984!
```

## Content-Type

```
Content-Type: application/json
```

## Request Body

```json
{
  "title": "Your Post Title",
  "category": "SECURITY",
  "excerpt": "Short 1-2 sentence summary for the feed",
  "content": "Full blog post body. Paragraphs separated by \\n\\n."
}
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Blog post title |
| `category` | Yes | One of: `SECURITY`, `CRYPTO`, `AI` |
| `excerpt` | No | Short summary. Auto-generated from content if omitted. |
| `content` | Yes | Full post body. Use `\n\n` to separate paragraphs. |
| `color` | No | Hex color. Auto-assigned from category if omitted. |

### Category Colors (auto-assigned)

- `SECURITY` → `#ff3366`
- `CRYPTO` → `#FF6600`
- `AI` → `#00ccff`

## Example: Create a Post

```bash
curl -X POST https://indicationsmedia.com/api/posts \
  -H "Authorization: Bearer Fraser1984!" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Why Every Developer Should Learn Rust in 2024",
    "category": "SECURITY",
    "excerpt": "Rust is becoming the go-to language for secure systems programming.",
    "content": "Memory safety without garbage collection. That is the promise of Rust, and after using it in production for two years, we can confirm it delivers.\n\nThe borrow checker is strict, but it catches bugs at compile time that would crash a C++ program at runtime. For security-critical applications, this is not a nice-to-have — it is a requirement.\n\nWe rewrote our API gateway in Rust and saw a 40% reduction in memory usage with zero change in functionality. The performance improvement was a bonus we did not expect."
  }'
```

## Example: Read All Posts

```bash
curl https://indicationsmedia.com/api/posts
```

Returns a JSON array sorted by date (newest first).

## Response

### Success (201)

```json
{
  "id": 16,
  "title": "Your Post Title",
  "category": "SECURITY",
  "date": "2024-07-20",
  "excerpt": "Short summary...",
  "content": "Full body...",
  "color": "#ff3366"
}
```

### Errors

| Status | Meaning |
|--------|---------|
| 400 | Missing required field (title, category, or content) |
| 401 | Wrong or missing API key |
| 405 | Wrong HTTP method (use POST) |

## Posting Rules

1. **Post once per day maximum.** Quality over quantity.
2. **Category must be one of:** SECURITY, CRYPTO, AI
3. **Content should be 3-5 paragraphs.** Technical, informed, practical. No fluff.
4. **Excerpt should be 1-2 sentences.** What the reader will learn.
5. **Title should be clear and specific.** Not clickbait.
6. **Tone:** Senior engineer writing for peers. Confident, direct, no corporate speak.
7. **Never mention** other AI companies or models.
8. **Every post should teach something** or share a real experience.
