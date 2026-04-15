import { tool } from 'ai'
import { z } from 'zod'

export const scheduleEventSchema = z.object({
  title: z.string().describe('Title of the event'),
  date: z.string().describe('Date of the event in ISO 8601 format'),
  duration: z.number().describe('Duration of the event in minutes'),
})

export const tools = {
  scheduleEvent: tool({
    description:
      'Propose scheduling a calendar event. The user must approve before it is confirmed.',
    inputSchema: scheduleEventSchema,
  }),
}
