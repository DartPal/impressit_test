# AI Chat — Senior Frontend Engineer Test Task

Streaming AI chat interface with human-in-the-loop tool approval, built with Next.js App Router, Vercel AI SDK, HeroUI, and Groq.

## Stack

- **Next.js** (App Router)
- **Vercel AI SDK** — `ai` + `@ai-sdk/react` + `@ai-sdk/groq`
- **HeroUI v3** — UI components
- **Tailwind CSS**
- **TypeScript** (strict)

## Setup

```bash
git clone <repo-url>
cd <repo>
cp .env.example .env.local
```

Add your Groq API key to `.env.local`:

```
GROQ_API_KEY=sk-...
```

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it works

1. Type a message asking to schedule an event (e.g. *"Schedule a team sync tomorrow at 10am for 30 minutes"*).
2. The assistant invokes the `scheduleEvent` tool and renders an **approval card** in the chat thread.
3. Click **Accept** → the assistant confirms the booking. Click **Reject** → the assistant asks what to change.
4. All LLM calls happen server-side in `app/api/chat/route.ts`. The client never touches the Groq API directly.

## Architecture

```
app/
├── api/chat/route.ts         ← POST handler: streamText + scheduleEvent tool
├── layout.tsx                ← Poppins font, global dark styles
└── page.tsx                  ← renders <ChatPage />
views/
└── ChatPage.tsx              ← "use client" composition root
components/
├── ChatInput.tsx             ← HeroUI Input + Button (send icon)
├── MessageList.tsx           ← renders text bubbles + tool cards
└── EventApprovalCard.tsx     ← HeroUI Card with Accept / Reject
hooks/
├── api/useAiChat.ts          ← wraps useChat → /api/chat
└── helpers/
    ├── useMessages.ts        ← useMemo: derive message parts
    └── useApproval.ts        ← useMemo: approval state per toolCallId
lib/tools.ts                  ← Zod schemas + tool definitions (no execute fn)
types/chat.ts                 ← EApprovalStatus, TEventPayload, TToolCallState
```

## Environment variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com) |
