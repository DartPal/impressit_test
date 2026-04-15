'use client'

import { useMemo } from 'react'
import { UIMessage } from 'ai'

export const useMessages = (messages: UIMessage[]) => {
  const processedMessages = useMemo(
    () => messages.filter((m) => m.parts && m.parts.length > 0),
    [messages]
  )

  return { processedMessages }
}
