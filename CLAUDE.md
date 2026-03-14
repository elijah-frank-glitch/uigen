# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator. Users describe components in a chat interface, Claude generates JSX/TSX files into a virtual file system (VFS), and the result is rendered live in a sandboxed iframe preview.

## Commands

```bash
npm run setup          # First-time: install deps, generate Prisma client, run migrations
npm run dev            # Dev server (Next.js + Turbopack on 0.0.0.0)
npm run build          # Production build
npm run lint           # ESLint (next lint)
npm test               # Vitest (all tests)
npx vitest run src/lib/__tests__/file-system.test.ts  # Single test file
npm run db:reset       # Reset SQLite database (destructive)
npx prisma generate    # Regenerate Prisma client after schema changes
npx prisma migrate dev # Run pending migrations
```

## Tech Stack

Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, shadcn/ui (new-york style), Vercel AI SDK with `@ai-sdk/anthropic` (claude-haiku-4-5), SQLite via Prisma 6, Monaco Editor, Babel Standalone for client-side JSX transform.

## Architecture

### Virtual File System (VFS)
`src/lib/file-system.ts` — In-memory tree of `FileNode` objects with full CRUD, rename, and text-editor operations (view, str_replace, insert, createFileWithParents). Serializes to/from JSON for SQLite storage.

### AI Chat Pipeline
`src/app/api/chat/route.ts` — POST endpoint streams AI responses. Claude gets two tools:
- `str_replace_editor` (`src/lib/tools/str-replace.ts`) — view/create/str_replace/insert on VFS
- `file_manager` (`src/lib/tools/file-manager.ts`) — rename/delete on VFS

The server reconstructs VFS from serialized state sent with each request, runs `streamText` with `maxSteps: 40`, and saves updated state to the project on completion.

### Live Preview Pipeline
`src/lib/transform/jsx-transformer.ts` — Client-side build: Babel transforms JSX/TSX, creates Blob URL import maps with `@/` alias resolution, fetches third-party packages from `esm.sh`, and generates `srcdoc` HTML with React, Tailwind CDN, and an ErrorBoundary.

### Context Architecture
Two stacked React contexts:
- `FileSystemProvider` (outer) — owns VFS instance, handles AI tool calls, exposes `refreshTrigger` counter for re-renders
- `ChatProvider` (inner) — wraps Vercel AI SDK `useChat`, serializes VFS state into API requests

### Mock Provider
When `ANTHROPIC_API_KEY` is empty, `MockLanguageModel` in `src/lib/provider.ts` streams pre-canned tool calls so the app works without an API key.

### Auth
JWT via `jose`, httpOnly cookies (`auth-token`, 7-day expiry). `src/lib/auth.ts` is server-only. Anonymous users can use the app; work is saved on sign-up/sign-in.

## Database Schema

Always reference `prisma/schema.prisma` for the database structure. Two models:
- **User** — id (cuid), email (unique), password, timestamps, has many Projects
- **Project** — id (cuid), name, optional userId (FK to User, cascade delete), `messages` (JSON string, default `"[]"`), `data` (JSON string, default `"{}"`), timestamps

## Key Conventions

- **Path alias:** `@/*` maps to `src/*` everywhere (TypeScript, Vitest, VFS preview runtime)
- **Prisma client import:** `@/generated/prisma` (not `@prisma/client`) — custom output to `src/generated/prisma`
- **VFS root entry point:** Every project must have `/App.jsx` as root with a default export
- **VFS imports:** Use `@/` prefix for local file imports within generated components
- **Styling:** Tailwind CSS only in generated components (no hardcoded styles, no HTML files)
- **Server/client boundaries:** Explicit `"use server"` on server actions (`src/actions/`), `"use client"` on client components
- **Tailwind v4:** Uses `@tailwindcss/postcss` plugin, configuration in CSS (no `tailwind.config.js`)
- **shadcn/ui:** new-york style, CSS variables, neutral base color, components in `src/components/ui/`
- **Tests:** `__tests__/` directories co-located with source, jsdom environment, `vi.mock()` for context deps
- **node-compat.cjs:** Required via NODE_OPTIONS to fix Node 25+ server-side localStorage/sessionStorage globals

## Environment Variables

- `ANTHROPIC_API_KEY` — Claude API key (optional; falls back to mock provider)
- `JWT_SECRET` — JWT signing key (defaults to `"development-secret-key"`)
