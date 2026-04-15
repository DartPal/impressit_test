import { google } from 'googleapis'
import { NextResponse } from 'next/server'

import { getOAuthClient, isGoogleEnabled } from '@lib/google'

type TSchedulePayload = { tool: 'scheduleEvent'; title: string; date: string; duration: number }
type TSendEmailPayload = { tool: 'sendEmail'; to: string; subject: string; body: string }
type TExecutePayload = TSchedulePayload | TSendEmailPayload

async function executeScheduleEvent(payload: TSchedulePayload) {
  const auth = getOAuthClient()
  if (!auth) {
    return { simulated: true }
  }

  const calendar = google.calendar({ version: 'v3', auth })
  const start = new Date(payload.date)
  const end = new Date(start.getTime() + payload.duration * 60 * 1000)

  await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: payload.title,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
    },
  })

  return { simulated: false }
}

async function executeSendEmail(payload: TSendEmailPayload) {
  const auth = getOAuthClient()
  if (!auth) {
    return { simulated: true }
  }

  const gmail = google.gmail({ version: 'v1', auth })

  const raw = Buffer.from(
    `To: ${payload.to}\r\nSubject: ${payload.subject}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${payload.body}`,
  )
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  await gmail.users.messages.send({ userId: 'me', requestBody: { raw } })

  return { simulated: false }
}

export async function POST(req: Request) {
  try {
    const payload: TExecutePayload = await req.json()

    if (payload.tool === 'scheduleEvent') {
      const result = await executeScheduleEvent(payload)
      return NextResponse.json({ ok: true, googleEnabled: isGoogleEnabled, ...result })
    }

    if (payload.tool === 'sendEmail') {
      const result = await executeSendEmail(payload)
      return NextResponse.json({ ok: true, googleEnabled: isGoogleEnabled, ...result })
    }

    return NextResponse.json({ ok: false, error: 'Unknown tool' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
