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
  const now = new Date().toISOString()

  const result = streamText({
    model: groq('llama-3.3-70b-versatile'),
    system:
      `TODAY IS ${now}. You MUST use this exact date as the basis for ALL date calculations. Never use any other date. When user says "today" use ${now.slice(0, 10)}, "tomorrow" means the next calendar day after ${now.slice(0, 10)}. ` +
      'You are a helpful assistant that can schedule calendar events, send emails, and create tasks. ' +
      'Use the scheduleEvent tool when the user wants to schedule something. Always provide the date in ISO 8601 format. ' +
      'Use the sendEmail tool when the user wants to send an email. If no address is provided, ask for it first. Compose a professional body from the user description. ' +
      'Use the createTask tool when the user wants to create a task or todo. Choose an appropriate priority (low/medium/high) based on context. Always provide dueDate in ISO 8601 format. ' +
      'When a tool result has confirmed=true, confirm the action with a friendly message. ' +
      'When a tool result has confirmed=false, you MUST respond with plain text asking which detail the user wants to change. Do NOT call any tool after a rejection.',
    messages: await convertToModelMessages(messages),
    tools,
    toolChoice: rejected ? 'none' : 'auto',
  })

  return result.toUIMessageStreamResponse()
}
