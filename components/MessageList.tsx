'use client'

import { Text } from '@heroui/react'
import type { UIMessage } from 'ai'
import { useEffect, useRef } from 'react'

import { ApprovalCard } from '@components/ApprovalCard'
import type {
  EApprovalStatus,
  TEmailPayload,
  TEventPayload,
  TScheduleEventPart,
  TSendEmailPart,
} from '@type'

interface IProps {
  messages: UIMessage[]
  getStatus: (toolCallId: string) => EApprovalStatus
  onAccept: (tool: string, toolCallId: string, payload: TEventPayload | TEmailPayload) => void
  onReject: (tool: string, toolCallId: string) => void
}

export const MessageList = ({ messages, getStatus, onAccept, onReject }: IProps) => {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-scroll flex flex-col gap-3 px-4 pt-6 pb-4 overflow-y-auto overflow-x-hidden flex-1 min-w-0">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex flex-col gap-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
        >
          {message.parts?.map((part, i) => {
            if (part.type === 'text') {
              return (
                <Text
                  key={i}
                  size="sm"
                  className="px-4 py-2 rounded-2xl max-w-[75%] whitespace-pre-wrap break-words bg-[#2f2f2f] text-[#ececec]"
                >
                  {part.text}
                </Text>
              )
            }

            if (part.type === 'tool-scheduleEvent') {
              const toolPart = part as TScheduleEventPart
              if (toolPart.state === 'input-available' || toolPart.state === 'output-available') {
                return (
                  <ApprovalCard
                    key={toolPart.toolCallId}
                    tool="scheduleEvent"
                    toolCallId={toolPart.toolCallId}
                    payload={toolPart.input}
                    status={getStatus(toolPart.toolCallId)}
                    onAccept={onAccept}
                    onReject={onReject}
                  />
                )
              }
            }

            if (part.type === 'tool-sendEmail') {
              const toolPart = part as TSendEmailPart
              if (toolPart.state === 'input-available' || toolPart.state === 'output-available') {
                return (
                  <ApprovalCard
                    key={toolPart.toolCallId}
                    tool="sendEmail"
                    toolCallId={toolPart.toolCallId}
                    payload={toolPart.input}
                    status={getStatus(toolPart.toolCallId)}
                    onAccept={onAccept}
                    onReject={onReject}
                  />
                )
              }
            }

            return null
          })}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
