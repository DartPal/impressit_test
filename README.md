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

Fill in `.env.local`:

```
GROQ_API_KEY=sk-...

# Optional — enables real Google Calendar + Gmail actions on Accept
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
```

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Google Integration (optional)

Without Google keys the app works fully — accepted tools show a confirmation message but no real API call is made. To enable real Calendar events and Gmail sends:

1. [console.cloud.google.com](https://console.cloud.google.com) → create a project
2. Enable **Google Calendar API** and **Gmail API**
3. **Credentials → Create OAuth 2.0 Client ID** (Web application)
   - Add `https://developers.google.com/oauthplayground` as an authorized redirect URI
4. **OAuth consent screen** → add your email as a test user
5. Go to [developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)
   - Gear icon → use your own credentials → paste Client ID + Secret
   - Select scopes: `gmail.send` + `calendar`
   - Authorize → Exchange code → copy `refresh_token`
6. Add all three values to `.env.local` and restart the dev server

## How it works

The assistant supports three human-in-the-loop tools. The model proposes an action, the user sees an approval card and clicks **Accept** or **Reject**:

- **Accept** → executes the real API call (if Google keys present) + assistant confirms
- **Reject** → assistant asks which detail to change, then re-proposes

Example prompts:

- _"Schedule a team sync tomorrow at 10am for 30 minutes"_
- _"Send an email to john@example.com about the project deadline"_
- _"Create a high priority task to review the PR by Friday"_

All LLM calls happen server-side in `app/api/chat/route.ts`. The client never touches the Groq API directly.

## Architecture

```
app/
├── api/
│   ├── chat/route.ts              ← POST: streamText + all tools, toolChoice guard
│   └── execute/route.ts           ← POST: real Google Calendar / Gmail API calls
├── layout.tsx
└── page.tsx
views/
└── ChatPage.tsx                   ← "use client" composition root
components/
├── ChatInput.tsx                  ← HeroUI Input + Button, autofocus after send
├── MessageList.tsx                ← text bubbles + tool cards, autoscroll
├── EventApprovalCard.tsx          ← schedule event card: Accept / Reject
├── EmailApprovalCard.tsx          ← send email card: Send / Reject
└── TaskApprovalCard.tsx           ← create task card: priority chip + Create / Reject
hooks/
├── api/
│   ├── useAiChat.ts               ← wraps useChat, sendAutomaticallyWhen per-toolCallId
│   └── useExecuteAction.ts        ← fetch calls to /api/execute
└── helpers/
    ├── useMessages.ts             ← useMemo: processed message list
    └── useApproval.ts             ← useMemo: approval state map per toolCallId
lib/
├── tools.ts                       ← Zod schemas + tool definitions (no execute fn)
└── google.ts                      ← OAuth2 client factory, isGoogleEnabled flag
types/
└── chat.ts                        ← EApprovalStatus, TEventPayload, TEmailPayload, TTaskPayload
```

## Environment variables

| Variable               | Required | Description                                               |
| ---------------------- | -------- | --------------------------------------------------------- |
| `GROQ_API_KEY`         | ✅       | API key from [console.groq.com](https://console.groq.com) |
| `GOOGLE_CLIENT_ID`     | optional | OAuth 2.0 client ID from Google Cloud Console             |
| `GOOGLE_CLIENT_SECRET` | optional | OAuth 2.0 client secret                                   |
| `GOOGLE_REFRESH_TOKEN` | optional | Refresh token with `calendar` + `gmail.send` scopes       |

## Scripts

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # ESLint check
npm run lint:fix     # ESLint auto-fix
npm run format       # Prettier write
npm run format:check # Prettier check
```
