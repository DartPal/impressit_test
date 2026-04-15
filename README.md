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

The assistant supports three human-in-the-loop tools. In each case the model proposes an action, the user sees an approval card, and clicks **Accept** or **Reject**:

- **Accept** → assistant confirms the action
- **Reject** → assistant asks which detail to change, then re-proposes with updates

Example prompts:
- *"Schedule a team sync tomorrow at 10am for 30 minutes"*
- *"Send an email to john@example.com about the project deadline"*
- *"Create a high priority task to review the PR by Friday"*

All LLM calls happen server-side in `app/api/chat/route.ts`. The client never touches the Groq API directly.

## Architecture

```
app/
├── api/chat/route.ts              ← POST handler: streamText + all tools, toolChoice guard
├── layout.tsx                     ← Poppins font, global dark styles
└── page.tsx                       ← renders <ChatPage />
views/
└── ChatPage.tsx                   ← "use client" composition root
components/
├── ChatInput.tsx                  ← HeroUI Input + Button, autofocus after send
├── MessageList.tsx                ← renders text bubbles + tool cards, autoscroll
├── EventApprovalCard.tsx          ← schedule event card with Accept / Reject
├── EmailApprovalCard.tsx          ← send email card with Send / Reject
└── TaskApprovalCard.tsx           ← create task card with priority chip + Create / Reject
hooks/
├── api/useAiChat.ts               ← wraps useChat, sendAutomaticallyWhen per-toolCallId
└── helpers/
    ├── useMessages.ts             ← useMemo: derive processed message list
    └── useApproval.ts             ← useMemo: approval state map per toolCallId
lib/
└── tools.ts                       ← Zod schemas + tool definitions (no execute fn)
types/
└── chat.ts                        ← EApprovalStatus, TEventPayload, TEmailPayload, TTaskPayload
```

## Environment variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com) |

