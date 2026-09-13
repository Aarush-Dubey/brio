# Agent Starter

A minimal full-stack starter using Next.js App Router, Convex, and LangGraph.js.

## Stack

- Next.js 16 + React 19 + TypeScript
- Convex backend with conversations and messages tables
- LangGraph.js agent workflow exposed through `/api/agent`
- Tailwind CSS 4

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Run `npx convex dev` once and follow the login/project prompts. This writes the Convex deployment values to `.env.local`.
4. Add `OPENAI_API_KEY` to `.env.local`.
5. Start both services with `npm run dev:all`, or use `npm run dev` for the Next.js UI only.

Without an OpenAI key, the chat runs the LangGraph and returns a setup message. Without a Convex URL, the UI still renders; the provider activates after Convex is configured.

## Project layout

```text
convex/                 Convex schema, queries, and mutations
src/app/api/agent/      LangGraph API route
src/components/         Client UI and Convex provider
src/lib/agent.ts        Agent graph definition
```

## Commands

- `npm run dev` — Next.js development server
- `npm run dev:convex` — Convex development sync
- `npm run dev:all` — both development processes
- `npm run lint` — ESLint
- `npm run build` — production build
