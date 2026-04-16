'use client'

import { Button, Card, CardContent, CardFooter, CardHeader, Chip, Text } from '@heroui/react'
import { useMemo } from 'react'

import { TOOLS_CONFIG } from '@consts'
import type { TEmailPayload, TEmailVariant, TEventPayload, TEventVariant } from '@type'
import { EApprovalStatus } from '@type'

import { EmailContent } from './EmailContent'
import { EventContent } from './EventContent'

type IProps = (TEventVariant | TEmailVariant) & {
  toolCallId: string
  status: EApprovalStatus
  onReject: (tool: string, toolCallId: string) => void
}

export const ApprovalCard = ({ tool, toolCallId, payload, status, onAccept, onReject }: IProps) => {
  const isPending = useMemo(() => status === EApprovalStatus.PENDING, [status])
  const meta = useMemo(() => TOOLS_CONFIG[tool], [tool])

  return (
    <Card className="max-w-sm border border-white/10 rounded-2xl bg-[#2f2f2f]" variant="default">
      <CardHeader className="flex flex-row gap-2 items-center pb-1">
        <Text size="sm" className="font-semibold text-[#ececec]">
          {meta.icon} {meta.title}
        </Text>
        {!isPending && (
          <Chip
            size="sm"
            color={status === EApprovalStatus.ACCEPTED ? 'success' : 'danger'}
            variant="soft"
          >
            {status === EApprovalStatus.ACCEPTED ? meta.acceptedLabel : 'Rejected'}
          </Chip>
        )}
      </CardHeader>
      <CardContent className="py-2 flex flex-col gap-1">
        {tool === 'scheduleEvent' ? (
          <EventContent payload={payload as TEventPayload} />
        ) : (
          <EmailContent payload={payload as TEmailPayload} />
        )}
      </CardContent>
      {isPending && (
        <CardFooter className="gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="text-green-400 border-green-400/40 hover:bg-green-400/10 rounded-xl"
            onPress={() => onAccept(tool, toolCallId, payload)}
          >
            {meta.acceptLabel}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-400 border-red-400/40 hover:bg-red-400/10 rounded-xl"
            onPress={() => onReject(tool, toolCallId)}
          >
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
