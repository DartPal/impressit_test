'use client'

import type { UIMessage } from 'ai'
import { useMemo } from 'react'

export const useMessages = (messages: UIMessage[]) => {
  const processedMessages = useMemo(
    () => messages.filter((m) => m.parts && m.parts.length > 0),
    [messages],
  )

  return { processedMessages }
}
