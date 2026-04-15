'use client'

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { DefaultChatTransport } from 'ai'
import { useRef, useState } from 'react'

export const useAiChat = () => {
  const [input, setInput] = useState('')
  const submittedToolCallIds = useRef(new Set<string>())

  const chat = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    sendAutomaticallyWhen: ({ messages }: { messages: UIMessage[] }) => {
      const last = messages[messages.length - 1]
      if (!last || last.role !== 'assistant') {
        return false
      }

      const pendingParts = (last.parts ?? []).filter(
        (p) =>
          'state' in p &&
          (p as { state: string; toolCallId: string }).state === 'output-available' &&
          !submittedToolCallIds.current.has((p as { toolCallId: string }).toolCallId),
      )

      if (!pendingParts.length) {
        return false
      }

      pendingParts.forEach((p) =>
        submittedToolCallIds.current.add((p as { toolCallId: string }).toolCallId),
      )

      return true
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) {
      return
    }
    chat.sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] })
    setInput('')
  }

  return { ...chat, input, handleInputChange, handleSubmit }
}
