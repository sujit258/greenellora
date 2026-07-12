# Graph Report - greenellora-main  (2026-07-01)

## Corpus Check
- 77 files · ~2,399,993 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 329 nodes · 585 edges · 22 communities (16 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]

## God Nodes (most connected - your core abstractions)
1. `connectDB()` - 34 edges
2. `useAdmin()` - 25 edges
3. `requireAuth()` - 19 edges
4. `compilerOptions` - 16 edges
5. `siteConfig` - 14 edges
6. `SectionHeading()` - 10 edges
7. `normalizeVideo()` - 10 edges
8. `SiteFooter()` - 9 edges
9. `SiteHeader()` - 8 edges
10. `getHandicraftProducts()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `requireAuth()`  [EXTRACTED]
  src/app/api/upload/route.ts → src/lib/auth.ts
- `AdminDashboard()` --calls--> `useAdmin()`  [EXTRACTED]
  src/app/admin/page.tsx → src/components/admin/AdminProvider.tsx
- `EditAyurvedicProductPage()` --calls--> `useAdmin()`  [EXTRACTED]
  src/app/admin/products/ayurvedic/[productId]/edit/page.tsx → src/components/admin/AdminProvider.tsx
- `NewAyurvedicProductPage()` --calls--> `useAdmin()`  [EXTRACTED]
  src/app/admin/products/ayurvedic/new/page.tsx → src/components/admin/AdminProvider.tsx
- `AdminAyurvedicProducts()` --calls--> `useAdmin()`  [EXTRACTED]
  src/app/admin/products/ayurvedic/page.tsx → src/components/admin/AdminProvider.tsx

## Import Cycles
- None detected.

## Communities (22 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (37): inter, metadata, organizationSchema, bannerSlides, icons, HandicraftProductsPage(), generateMetadata(), generateStaticParams() (+29 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (27): AdminDashboard(), Stats, NewAyurvedicProductPage(), AdminAyurvedicProducts(), AyurvedicProduct, EditAyurvedicProductPage(), NewHandicraftProductPage(), AdminHandicraftProducts() (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (30): DELETE(), GET(), PUT(), GET(), POST(), DELETE(), GET(), PUT() (+22 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (34): dependencies, bcryptjs, dotenv, jsonwebtoken, lucide-react, mongodb, mongoose, next (+26 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (18): AyurvedicProductsPage(), AyurvedicProductPage(), AyurvedicProductPageProps, generateMetadata(), generateStaticParams(), ProductCard(), ProductCardProps, Product (+10 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (15): POST(), POST(), GET(), ALLOWED_TYPES, POST(), UPLOAD_DIR, generateToken(), getAdminFromRequest() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (15): adminSchema, AyurvedicProduct, ayurvedicProducts, ayurvedicProductSchema, bcrypt, dotenv, HandicraftProduct, handicraftProducts (+7 more)

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (7): Video, SiteHeader(), VideoCard(), VideoCardProps, extractYoutubeId(), getYoutubeThumbnail(), VideoItem

### Community 9 - "Community 9"
Cohesion: 0.24
Nodes (7): QuoteFormState, submitQuoteForm(), ENQUIRY_TYPES, initialState, PRODUCTS, QuoteForm(), QuoteFormProps

### Community 10 - "Community 10"
Cohesion: 0.29
Nodes (5): adminSchema, bcrypt, dotenv, mongoose, path

### Community 11 - "Community 11"
Cohesion: 0.33
Nodes (5): Getting started, Green Ellora, Included, Placeholder content to replace, Stack

### Community 12 - "Community 12"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

## Knowledge Gaps
- **133 isolated node(s):** `__filename`, `__dirname`, `compat`, `eslintConfig`, `nextConfig` (+128 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `connectDB()` connect `Community 2` to `Community 0`, `Community 4`, `Community 5`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `normalizeVideos()` connect `Community 2` to `Community 0`, `Community 8`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `siteConfig` connect `Community 0` to `Community 4`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `compat` to the rest of the system?**
  _133 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06775956284153005 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07729468599033816 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10852713178294573 - nodes in this community are weakly interconnected._