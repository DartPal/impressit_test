'use client'

import { Button, Card, CardContent, CardFooter, CardHeader, Chip } from '@heroui/react'

import type { TTaskPayload } from '@type/chat'
import { EApprovalStatus } from '@type/chat'

interface IProps {
  toolCallId: string
  payload: TTaskPayload
  status: EApprovalStatus
  onAccept: (tool: string, toolCallId: string, payload: TTaskPayload) => void
  onReject: (tool: string, toolCallId: string) => void
}

const priorityColor: Record<string, 'success' | 'warning' | 'danger'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
}

export const TaskApprovalCard = ({ toolCallId, payload, status, onAccept, onReject }: IProps) => {
  const isPending = status === EApprovalStatus.PENDING

  return (
    <Card className="max-w-sm border border-white/10 rounded-2xl bg-[#2f2f2f]" variant="default">
      <CardHeader className="flex flex-row gap-2 items-center pb-1">
        <span className="text-sm font-semibold text-[#ececec]">✅ Create Task</span>
        {!isPending && (
          <Chip
            size="sm"
            color={status === EApprovalStatus.ACCEPTED ? 'success' : 'danger'}
            variant="soft"
          >
            {status === EApprovalStatus.ACCEPTED ? 'Created' : 'Rejected'}
          </Chip>
        )}
      </CardHeader>
      <CardContent className="py-2 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-[#ececec]">{payload.title}</p>
          <Chip size="sm" color={priorityColor[payload.priority] ?? 'warning'} variant="soft">
            {payload.priority}
          </Chip>
        </div>
        {payload.description && (
          <p className="text-xs text-[#8e8ea0] whitespace-pre-wrap break-words">
            {payload.description}
          </p>
        )}
        <p className="text-xs text-[#8e8ea0]">
          Due:{' '}
          {(() => {
            const d = new Date(payload.dueDate)
            return isNaN(d.getTime())
              ? payload.dueDate
              : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
          })()}
        </p>
      </CardContent>
      {isPending && (
        <CardFooter className="gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="text-green-400 border-green-400/40 hover:bg-green-400/10 rounded-xl"
            onPress={() => onAccept('createTask', toolCallId, payload)}
          >
            Create
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-400 border-red-400/40 hover:bg-red-400/10 rounded-xl"
            onPress={() => onReject('createTask', toolCallId)}
          >
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
