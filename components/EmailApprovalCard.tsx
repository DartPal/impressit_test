'use client'

import { Button, Card, CardContent, CardFooter, CardHeader, Chip } from '@heroui/react'

import type { TEmailPayload } from '@type/chat'
import { EApprovalStatus } from '@type/chat'

interface IProps {
  toolCallId: string
  payload: TEmailPayload
  status: EApprovalStatus
  onAccept: (tool: string, toolCallId: string) => void
  onReject: (tool: string, toolCallId: string) => void
}

export const EmailApprovalCard = ({ toolCallId, payload, status, onAccept, onReject }: IProps) => {
  const isPending = status === EApprovalStatus.PENDING

  return (
    <Card className="max-w-sm border border-white/10 rounded-2xl bg-[#2f2f2f]" variant="default">
      <CardHeader className="flex flex-row gap-2 items-center pb-1">
        <span className="text-sm font-semibold text-[#ececec]">✉️ Send Email</span>
        {!isPending && (
          <Chip
            size="sm"
            color={status === EApprovalStatus.ACCEPTED ? 'success' : 'danger'}
            variant="soft"
          >
            {status === EApprovalStatus.ACCEPTED ? 'Sent' : 'Rejected'}
          </Chip>
        )}
      </CardHeader>
      <CardContent className="py-2 flex flex-col gap-1">
        <p className="text-xs text-[#8e8ea0]">
          To: <span className="text-[#ececec]">{payload.to}</span>
        </p>
        <p className="text-xs text-[#8e8ea0]">
          Subject: <span className="text-[#ececec] font-medium">{payload.subject}</span>
        </p>
        <p className="text-xs text-[#8e8ea0] mt-1 whitespace-pre-wrap break-words border-t border-white/10 pt-2">
          {payload.body}
        </p>
      </CardContent>
      {isPending && (
        <CardFooter className="gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="text-green-400 border-green-400/40 hover:bg-green-400/10 rounded-xl"
            onPress={() => onAccept('sendEmail', toolCallId)}
          >
            Send
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-400 border-red-400/40 hover:bg-red-400/10 rounded-xl"
            onPress={() => onReject('sendEmail', toolCallId)}
          >
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
