# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**db_personal** - Employee management system for Kronosmining. Centralized database for personnel information used by contract administrators. Currently in private beta with agile development approach.

**Deployment:** `personal.kronosmining.tech`

## Common Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Production build (outputs to /dist)
npm run preview      # Preview production build

# Code Quality  
npm run lint         # Run ESLint with zero warnings tolerance
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run typecheck    # TypeScript type checking without emit
```

## Tech Stack & Architecture

**Frontend Stack:**
- Vite 5 + React 19 + TypeScript 5
- Tailwind CSS v4 (zero-config) with corporate color `#d56301`
- Planned: TanStack Query v5 (data state), TanStack Table v8 (tables), TanStack Virtual v3

**Backend:**
- Supabase with Row Level Security (RLS)
- Main table: `public.empleados` with Chilean-specific validation
- Public read/insert permissions for anonymous users

**Key Dependencies (Missing - Need Installation):**
- `@tanstack/react-query` v5
- `@tanstack/react-table` v8  
- `@tanstack/react-virtual` v3
- `zod` v3 (validation)
- `react-hook-form` v7

## Architecture Patterns

**Data Flow:**
- React Query for server state management and caching
- Zod schemas for validation (matches Supabase constraints)
- React Hook Form for form handling
- No session persistence - anonymous public access

**UI Architecture:**
- Desktop-first table view with virtualization for performance
- Mobile-friendly form views
- Component-based design system with Tailwind utilities
- Dark theme default (iOS Dark inspired)

**Database Security:**
- Row Level Security policies: `empleados_read_anon`, `empleados_insert_anon`
- Strict constraints for Chilean data (banks, health providers, pension funds)

## Development Context

**Essential Documentation:**
- `docs/FRONTEND-CONTEXT.md` - Component specifications and React architecture
- `docs/THEME.md` - Design system, CSS tokens, accessibility guidelines
- `docs/DB-MIGRATIONS.md` - Database schema and security policies

**Environment Setup:**
- Node.js 20+ required
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Supabase client configured in `src/lib/supabase.ts`

**Current Implementation Status:**
- Basic scaffolding with Vite + React setup ✅
- Tailwind v4 with corporate branding ✅  
- ESLint + Prettier configuration ✅
- Core data management dependencies missing ❌
- Employee table components not implemented ❌

## Code Standards

**TypeScript:**
- Strict mode enabled with ES2022+ target
- Two configs: `tsconfig.app.json` (src/), `tsconfig.node.json` (build)

**ESLint:**
- Flat config format (v9) with TypeScript integration
- Zero warnings policy enforced
- Prettier compatibility configured

**Styling:**
- Tailwind CSS v4 with CSS variables
- WCAG AA accessibility compliance required
- Corporate primary color: `#d56301`

## Development Workflow

**Reflect Before Continuing:** Does the output make sense? Does it meet criteria? Any risks/inconsistencies?
- **Plan the Iteration** (bullets): files to touch; dependencies; tests/acceptance criteria; rollback.
- **Clean Up Temporary Files**: delete test scripts, logs, unused imports, commented code, unofficial artifacts.