# Green Ellora

SEO-friendly Next.js marketing website for the Green Ellora export brand.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- ESLint

## Included

- Premium responsive homepage inspired by the provided export-brand reference
- Search-friendly metadata, Open Graph, Twitter metadata, sitemap, robots, and manifest
- Reusable UI sections and structured content data
- Placeholder brand contact details that should be replaced before production launch

## Getting started

1. Install dependencies with `npm install`
2. Configure mail settings in `.env.local`:

```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM_EMAIL=noreply@greenellora.com
SMTP_FROM_NAME=Green Ellora
QUOTE_TO_EMAIL=hello@greenellora.com
```

3. Restart dev server after changing env values
4. Start development with `npm run dev`
5. Build for production with `npm run build`

## Placeholder content to replace

- `hello@greenellora.com`
- `+91 00000 00000`
- `https://www.greenellora.com`
- Any final product/category copy and brand assets
