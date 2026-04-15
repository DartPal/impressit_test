import { createGroq } from '@ai-sdk/groq'
import { convertToModelMessages, streamText, UIMessage } from 'ai'
import { tools } from '@lib/tools'

const groq = createGroq()

export const maxDuration = 30

function lastToolWasRejected(messages: UIMessage[]): boolean {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i]
    if (msg.role === 'user') return false
    if (msg.role !== 'assistant') continue
    const toolPart = msg.parts?.find(
      (p) =>
        'state' in p &&
        (p as { state: string }).state === 'output-available' &&
        'output' in p,
    )
    if (toolPart) {
      const output = (toolPart as { output: { confirmed?: boolean } }).output
      return output?.confirmed === false
    }
  }
  return false
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const rejected = lastToolWasRejected(messages)

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system:
      'You are a helpful assistant that can schedule calendar events. When the user asks to schedule something, use the scheduleEvent tool to propose the event details. Always provide the date in ISO 8601 format (e.g. 2024-04-16T10:00:00). When the tool result has confirmed=true, confirm the booking with a friendly message. When the tool result has confirmed=false, you MUST respond with a plain text message asking which detail the user wants to change (title, date, or duration). Do NOT call any tool after a rejection.',
    messages: await convertToModelMessages(messages),
    tools,
    toolChoice: rejected ? 'none' : 'auto',
  })

  return result.toUIMessageStreamResponse()
}
