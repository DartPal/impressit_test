'use client'

import { useEffect, useRef } from 'react'
import { UIMessage } from 'ai'
import { EApprovalStatus, TEmailPayload, TEventPayload, TTaskPayload } from '@type/chat'
import { EventApprovalCard } from '@components/EventApprovalCard'
import { EmailApprovalCard } from '@components/EmailApprovalCard'
import { TaskApprovalCard } from '@components/TaskApprovalCard'

interface IProps {
  messages: UIMessage[]
  getStatus: (toolCallId: string) => EApprovalStatus
  onAccept: (tool: string, toolCallId: string) => void
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
                <div
                  key={i}
                  className="px-4 py-2 rounded-2xl max-w-[75%] text-sm whitespace-pre-wrap break-words bg-[#2f2f2f] text-[#ececec]"
                >
                  {part.text}
                </div>
              )
            }

            if (part.type === 'tool-scheduleEvent') {
              const toolPart = part as {
                type: 'tool-scheduleEvent'
                toolCallId: string
                state: string
                input: TEventPayload
              }
              if (toolPart.state === 'input-available' || toolPart.state === 'output-available') {
                return (
                  <EventApprovalCard
                    key={toolPart.toolCallId}
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
              const toolPart = part as {
                type: 'tool-sendEmail'
                toolCallId: string
                state: string
                input: TEmailPayload
              }
              if (toolPart.state === 'input-available' || toolPart.state === 'output-available') {
                return (
                  <EmailApprovalCard
                    key={toolPart.toolCallId}
                    toolCallId={toolPart.toolCallId}
                    payload={toolPart.input}
                    status={getStatus(toolPart.toolCallId)}
                    onAccept={onAccept}
                    onReject={onReject}
                  />
                )
              }
            }

            if (part.type === 'tool-createTask') {
              const toolPart = part as {
                type: 'tool-createTask'
                toolCallId: string
                state: string
                input: TTaskPayload
              }
              if (toolPart.state === 'input-available' || toolPart.state === 'output-available') {
                return (
                  <TaskApprovalCard
                    key={toolPart.toolCallId}
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
