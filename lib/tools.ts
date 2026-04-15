import { tool } from 'ai'
import { z } from 'zod'

export const scheduleEventSchema = z.object({
  title: z.string().describe('Title of the event'),
  date: z.string().describe('Date of the event in ISO 8601 format'),
  duration: z.number().describe('Duration of the event in minutes'),
})

export const sendEmailSchema = z.object({
  to: z.string().describe('Recipient email address'),
  subject: z.string().describe('Email subject line'),
  body: z.string().describe('Email body text'),
})

export const createTaskSchema = z.object({
  title: z.string().describe('Task title'),
  description: z.string().describe('Task description'),
  dueDate: z.string().describe('Due date in ISO 8601 format'),
  priority: z.string().describe('Task priority: low, medium, or high'),
})

export const tools = {
  scheduleEvent: tool({
    description:
      'Propose scheduling a calendar event. The user must approve before it is confirmed.',
    inputSchema: scheduleEventSchema,
  }),
  sendEmail: tool({
    description: 'Compose and propose sending an email. The user must approve before it is sent.',
    inputSchema: sendEmailSchema,
  }),
  createTask: tool({
    description: 'Propose creating a task. The user must approve before it is created.',
    inputSchema: createTaskSchema,
  }),
}
