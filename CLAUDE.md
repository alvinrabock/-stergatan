# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Common development commands for this Östers IF website (Next.js project):

- `npm run dev` / `pnpm dev` - Start development server on http://localhost:3000
- `npm run build` / `pnpm build` - Build production version
- `npm run start` / `pnpm start` - Start production server
- `npm run lint` / `pnpm lint` - Run ESLint

Package management uses pnpm (version 9.15.2+ as specified in package.json).

## Architecture

This is a Next.js 15 application for Östers IF (Swedish football club) with the following structure:

### Core Technologies
- **Next.js 15** with App Router
- **TypeScript** with strict mode
- **Tailwind CSS 4.0** for styling
- **Apollo Client** for GraphQL data fetching
- **Payload CMS** integration (admin bar, live preview, rich text editor)
- **React 19** with concurrent features

### Directory Structure

**`src/app/`** - Next.js App Router pages and layouts
- Contains route-based pages for different sections (matcher, nyheter, lag, etc.)
- `layout.tsx` defines the root layout with custom fonts (Oswald, Poppins)
- `components/` contains shared UI components (Header, Footer, etc.)

**`src/blocks/`** - Reusable content blocks
- Modular components like ArchiveBlock, MatchPickerBlock, TabellBlock
- Each block follows a Component.tsx pattern
- Used for flexible content management and page building

**`src/lib/`** - Data fetching and business logic
- Match data fetching functions (fetchMatches.ts, fetchSingleMatch.ts, etc.)
- Apollo GraphQL client setup and queries in `apollo/` subdirectory
- Live sports data integration functions
- Custom hooks like useMatchData.ts

**`src/components/`** - Reusable UI components
**`src/providers/`** - React context providers (UI context)
**`src/utils/`** - Utility functions
**`src/types.ts`** - TypeScript type definitions (large file with content blocks, media, posts)

### Key Features
- **Sports Data Integration**: Extensive match data fetching, live stats, player information
- **Content Management**: Payload CMS blocks for flexible page building
- **Multi-language Support**: Swedish language (sv) as primary
- **Partner Integration**: Partner header and networking features
- **Rich Content**: Support for videos, images, documents, FAQ blocks

### External Integrations
- Image hosting from multiple domains (svenskelitfotboll.se, googleapis.com, ytimg.com)
- Sports data APIs for match information
- Azure Service Bus for messaging

### Path Aliases
- `@/*` maps to `src/*`
- `@payload-config` maps to `./src/payload.config.ts`