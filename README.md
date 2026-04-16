# AI Chat

Chat UI that streams responses and lets you approve or reject AI-proposed actions before they go through.

## Setup

Clone the repo, then create `.env.local`:

```
GROQ_API_KEY=your-key-here
```

Get a free key at [console.groq.com](https://console.groq.com).

```bash
npm install && npm run dev
```

→ [http://localhost:3000](http://localhost:3000)

## Testing

Ask it to schedule something or send an email — it'll show a card to confirm before proceeding.

```
"Schedule a team sync tomorrow at 10am for 30 minutes"
"Send an email to jane@example.com about the project deadline"
```
