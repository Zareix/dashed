# GitHub Copilot Instructions for Dashed

## Project Overview

Dashed is a self-hosted dashboard application built with Astro, React, and Bun. It provides a customizable service dashboard with widget integrations for monitoring various self-hosted services and applications.

## Tech Stack

- **Framework**: Astro 5.x with SSR (server-side rendering)
- **Runtime**: Bun
- **UI Framework**: React 19
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Shadcn/ui
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query
- **Code Quality**: Biome (linter and formatter)

## Code Style & Conventions

### General Guidelines

- Follow functional programming patterns where appropriate
- Prefer type inference over explicit typing when TypeScript can infer correctly

### File Organization

```
src/
├── actions/          # Astro server actions
├── components/       # React and Astro components
│   ├── admin/       # Admin panel components
│   ├── category/    # Category management
│   ├── service/     # Service display and management
│   └── ui/          # Reusable UI components (shadcn/ui style)
├── layouts/         # Astro layouts
├── lib/             # Shared utilities and configuration
│   ├── db/         # Database schema and client
│   └── widgets/    # Widget type definitions and schemas
├── pages/          # Astro pages (file-based routing)
└── styles/         # Global styles
```

### Component Conventions

1. **Astro Components**: Use `.astro` extension for server-rendered components
2. **React Components**: Use `.tsx` extension for client-side interactive components
3. **UI Components**: Follow shadcn/ui patterns

### Database Schema

- Use Drizzle ORM with SQLite
- Table definitions are in `src/lib/db/schema.ts`
- Main entities:
  - `categoryTable`: Categories for organizing services
  - `serviceTable`: Individual services/applications with widget configurations

### Widget System

- Widget schemas are defined in `src/lib/widgets/index.ts` using Zod
- Each widget has a discriminated union type based on `type` field
- Widget frontend implementations are in `src/components/service/widget/widgets/`
- When adding new widgets:
  1. Define schema in `src/lib/widgets/index.ts`
  2. Add to `WIDGETS` discriminated union
  3. Create widget component in `src/components/service/widget/widgets/`
  4. Implement data fetching in `src/actions/widget.ts` and corresponding `src/lib/widgets/<type>.ts`
  5. Follow existing widget patterns for API calls and error handling

### API & Data Fetching

- Use Astro Actions for server-side data mutations
- Use TanStack Query for client-side data fetching and caching
- Handle errors gracefully with try-catch wrappers
- Validate all external inputs with Zod schemas

### Styling Guidelines

- Use Shadcn/ui components as base and as much as possible
- Use Tailwind CSS utility classes
- Use the `cn()` helper from `src/lib/utils.ts` for conditional classes
- Follow the existing design system (use UI components from `src/components/ui/`)

### Type Safety

- Leverage TypeScript's type inference
- Use Zod for runtime validation
- Prefer `type` over `interface` for object types
- Use discriminated unions for polymorphic data (like widgets)

## Common Patterns

### Form Handling

- Use React Hook Form with Zod resolver
- Use UI components from `src/components/ui/`
- Show validation errors inline
- Use optimistic updates with TanStack Query

### Drag and Drop

- Use `@dnd-kit/core` and `@dnd-kit/sortable`
- Update `order` field in database after reordering
- Provide visual feedback during drag operations

## Testing & Quality

- Run `bun run lint` before committing
- Use `bun run check` to auto-fix formatting issues and run type checks

## Security Considerations

- Never hardcode API keys or secrets
- Store sensitive widget configurations in the database
- Validate all user inputs

## Performance

- Use `server:defer` for non-critical Astro components
- Minimize client-side JavaScript
- Use React Query's caching effectively
- Keep widget API calls efficient with proper error handling

## Common Commands

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun run db:push` - Push schema changes to database
- `bun run db:studio` - Open Drizzle Studio
- `bun run lint` - Check code quality
- `bun run check` - Auto-fix and type check

## Notes for Copilot

- This project uses Bun as the runtime, not Node.js
- Astro components use `---` frontmatter for server-side logic
- Props in Astro use `Astro.props` or destructuring in frontmatter
- React components used in Astro need explicit client directives
- Database operations should happen in Astro Actions or server endpoints
- The UI follows a card-based dashboard layout with drag-and-drop reordering
