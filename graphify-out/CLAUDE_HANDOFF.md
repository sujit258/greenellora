# Claude handoff for Green Ellora

## Project summary
This repository is a Next.js marketing and admin application for Green Ellora. The codebase centers on:
- Public storefront pages and product/service content
- Admin dashboard flows for managing products and videos
- API routes for authentication, uploads, and CRUD operations
- Shared libraries for database access, auth, and site configuration

## Graph build status
- Built from the codebase only (no semantic API key was available)
- Verified outputs:
  - graph.json
  - graph.html
  - GRAPH_REPORT.md
- Graph metrics from the build:
  - 329 nodes
  - 585 edges
  - 22 communities

## Strongly connected / central nodes
These are the most connected abstractions in the graph and are good entry points for understanding the system:
- connectDB()
- useAdmin()
- requireAuth()
- compilerOptions
- siteConfig
- SectionHeading()
- normalizeVideo()
- SiteFooter()
- SiteHeader()
- getHandicraftProducts()

## Notable cross-cutting relationships
The graph highlights these important bridges between areas of the app:
- Upload API routes depend on auth middleware
- The admin UI is tightly connected to the admin provider hook
- Product management pages are linked to the shared admin context
- Video handling utilities connect content and UI components
- Shared site configuration ties content pages together

## Suggested exploration questions for Claude
- Why does connectDB() connect the API, admin, and content layers?
- Why does normalizeVideo() bridge the content and UI communities?
- How does siteConfig influence the public product pages?
- Which nodes are weakly connected and may indicate documentation or architecture gaps?
- Should the admin-related communities be split into smaller modules?

## Files to inspect first
- src/app/admin/page.tsx
- src/components/admin/AdminProvider.tsx
- src/lib/auth.ts
- src/lib/db.ts
- src/app/api/upload/route.ts
- src/app/services/ayurvedic-products/page.tsx
- src/components/quote-form.tsx
- src/lib/videos.ts

## Graph files
- Graph JSON: graphify-out/graph.json
- Interactive graph: graphify-out/graph.html
- Text report: graphify-out/GRAPH_REPORT.md
