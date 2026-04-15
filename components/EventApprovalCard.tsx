'use client'

import { Button, Card, CardContent, CardFooter, CardHeader, Chip } from '@heroui/react'
import { EApprovalStatus, TEventPayload } from '@type/chat'

interface IProps {
  toolCallId: string
  payload: TEventPayload
  status: EApprovalStatus
  onAccept: (toolCallId: string) => void
  onReject: (toolCallId: string) => void
}

export const EventApprovalCard = ({ toolCallId, payload, status, onAccept, onReject }: IProps) => {
  const isPending = status === EApprovalStatus.PENDING

  return (
    <Card className="max-w-sm border border-white/10 rounded-2xl bg-[#2f2f2f]" variant="default">
      <CardHeader className="flex flex-row gap-2 items-center pb-1">
        <span className="text-sm font-semibold text-[#ececec]">📅 Schedule Event</span>
        {!isPending && (
          <Chip
            size="sm"
            color={status === EApprovalStatus.ACCEPTED ? 'success' : 'danger'}
            variant="soft"
          >
            {status === EApprovalStatus.ACCEPTED ? 'Accepted' : 'Rejected'}
          </Chip>
        )}
      </CardHeader>
      <CardContent className="py-2 flex flex-col gap-1">
        <p className="text-sm font-medium text-[#ececec]">{payload.title}</p>
        <p className="text-xs text-[#8e8ea0]">
          {(() => {
            const d = new Date(payload.date)
            return isNaN(d.getTime())
              ? payload.date
              : d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
          })()}
        </p>
        <p className="text-xs text-[#8e8ea0]">{payload.duration} minutes</p>
      </CardContent>
      {isPending && (
        <CardFooter className="gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="text-green-400 border-green-400/40 hover:bg-green-400/10 rounded-xl"
            onPress={() => onAccept(toolCallId)}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-400 border-red-400/40 hover:bg-red-400/10 rounded-xl"
            onPress={() => onReject(toolCallId)}
          >
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
