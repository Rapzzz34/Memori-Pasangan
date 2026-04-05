# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Session**: express-session
- **File uploads**: multer

## Artifacts

### Kenangan Kita (`artifacts/bucin-web`)
A romantic couple memory website ("web bucin") at `/`.
- **Public page**: Gallery of couple memories, shows couple names, love date, and heartfelt message
- **Owner panel**: `/owner` — password-protected dashboard to manage memories and settings
- **Features**: Upload photos from file (not URL), add/edit/delete memories, edit couple names/dates/message

### API Server (`artifacts/api-server`)
Express 5 API serving the frontend. Routes:
- `POST /api/auth/login` — owner login with password
- `POST /api/auth/logout` — logout
- `GET /api/auth/me` — check session
- `GET/POST /api/memories` — list/create memories (POST with multipart/form-data)
- `GET/PATCH/DELETE /api/memories/:id` — get/edit/delete a memory
- `GET/PATCH /api/settings` — get/update site settings
- `GET /api/uploads/:filename` — serve uploaded images

## Authentication

Owner password is set via `OWNER_PASSWORD` environment secret.
Default password (fallback): `kenangan123`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Database Tables

- `memories` — photo memories (id, title, caption, image_url, memory_date, created_at, updated_at)
- `site_settings` — couple info (id, person1_name, person2_name, love_date, love_message, cover_image_url, updated_at)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
