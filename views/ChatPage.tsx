'use client'

import { useMemo } from 'react'

import { ChatInput } from '@components/ChatInput'
import { MessageList } from '@components/MessageList'
import { useAiChat } from '@hooks/api/useAiChat'
import { useApproval } from '@hooks/helpers/useApproval'
import { useMessages } from '@hooks/helpers/useMessages'

export const ChatPage = () => {
  const { messages, input, handleInputChange, handleSubmit, addToolResult, status } = useAiChat()
  const { processedMessages } = useMessages(messages)
  const { approve, reject, getStatus } = useApproval()

  const isLoading = useMemo(() => status === 'streaming' || status === 'submitted', [status])

  const handleAccept = useMemo(
    () => (tool: string, toolCallId: string) => {
      approve(toolCallId)
      addToolResult({
        tool,
        toolCallId,
        output: { confirmed: true, message: 'User accepted.' },
      })
    },
    [approve, addToolResult],
  )

  const handleReject = useMemo(
    () => (tool: string, toolCallId: string) => {
      reject(toolCallId)
      addToolResult({
        tool,
        toolCallId,
        output: {
          confirmed: false,
          message: 'User rejected. Ask the user what they would like to change.',
        },
      })
    },
    [reject, addToolResult],
  )

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto w-full">
      <header className="px-4 py-3 border-b border-white/10 bg-[#212121]">
        <h1 className="text-lg font-semibold text-[#ececec]">AI Assistant</h1>
        <p className="text-xs text-[#8e8ea0]">Schedule events, send emails or create tasks</p>
      </header>
      <MessageList
        messages={processedMessages}
        getStatus={getStatus}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
