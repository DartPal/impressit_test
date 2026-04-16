'use client'

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { DefaultChatTransport } from 'ai'
import { useCallback, useRef, useState } from 'react'

type TToolPart = { type: `tool-${string}`; state: string; toolCallId: string }

const isToolPart = (p: unknown): p is TToolPart =>
  typeof p === 'object' &&
  p !== null &&
  'type' in p &&
  typeof (p as { type: unknown }).type === 'string' &&
  (p as { type: string }).type.startsWith('tool-') &&
  'state' in p &&
  'toolCallId' in p

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

      const pendingParts = (last.parts ?? []).filter((p) => {
        if (!isToolPart(p)) {
          return false
        }
        return p.state === 'output-available' && !submittedToolCallIds.current.has(p.toolCallId)
      })

      if (!pendingParts.length) {
        return false
      }

      pendingParts.forEach((p) => {
        if (isToolPart(p)) {
          submittedToolCallIds.current.add(p.toolCallId)
        }
      })
      return true
    },
  })

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value),
    [],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!input.trim()) {
        return
      }
      chat.sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] })
      setInput('')
    },
    [chat, input],
  )

  return {
    messages: chat.messages,
    addToolResult: chat.addToolResult,
    status: chat.status,
    input,
    handleInputChange,
    handleSubmit,
  }
}
