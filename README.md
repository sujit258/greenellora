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
2. Copy `.env.example` to `.env.local` and configure the cloud services. MongoDB Compass is only a desktop viewer; the application connects directly to a managed MongoDB database such as MongoDB Atlas. Images are uploaded to and served from Cloudinary.

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_FOLDER=greenellora
ADMIN_USERNAME=admin
ADMIN_PASSWORD=use-a-strong-password
JWT_SECRET=use-a-long-random-secret
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM_EMAIL=noreply@greenellora.com
SMTP_FROM_NAME=Green Ellora
QUOTE_TO_EMAIL=hello@greenellora.com
```

3. In MongoDB Atlas, allow network access from your deployment provider (or use its documented secure connection option). Add the same variables to your hosting provider's environment settings before deployment.
4. Restart dev server after changing env values
5. Start development with `npm run dev`
6. Build for production with `npm run build`

To create or reset the admin account in the cloud database, set `ADMIN_USERNAME` and `ADMIN_PASSWORD`, then run:

```bash
npm run seed:admin
```

To show a free click-to-WhatsApp button after a successful enquiry, add your business number with country code (digits only):

```env
WHATSAPP_BUSINESS_NUMBER=919876543210
```

The visitor confirms the message in WhatsApp before it is sent; this option does not require the paid WhatsApp Business API.

## Cloud deployment

Deploy the Next.js app to a Node.js-compatible host such as Vercel. Set every variable from `.env.example` in the host's production environment. The app no longer has a local MongoDB fallback: it requires `MONGODB_URI` to be a non-local, managed database connection. Uploaded product images receive permanent HTTPS URLs from Cloudinary and are therefore available on every deployment instance.

## Placeholder content to replace

- `hello@greenellora.com`
- `+91 00000 00000`
- `https://www.greenellora.com`
- Any final product/category copy and brand assets
