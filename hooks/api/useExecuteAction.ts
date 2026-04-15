'use client'

import { useCallback } from 'react'

import type { TEmailPayload, TEventPayload } from '@type/chat'

type TExecuteResult = { ok: boolean; googleEnabled?: boolean; simulated?: boolean; error?: string }

async function safePost(body: object): Promise<TExecuteResult> {
  const res = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      return { ok: false, error: text || `HTTP ${res.status}` }
    }
  }
  return res.json()
}

export const useExecuteAction = () => {
  const executeSchedule = useCallback(
    (payload: TEventPayload): Promise<TExecuteResult> =>
      safePost({ tool: 'scheduleEvent', ...payload }),
    [],
  )

  const executeEmail = useCallback(
    (payload: TEmailPayload): Promise<TExecuteResult> =>
      safePost({ tool: 'sendEmail', ...payload }),
    [],
  )

  return { executeSchedule, executeEmail }
}
