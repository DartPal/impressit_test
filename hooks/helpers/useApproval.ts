'use client'

import { useMemo, useState } from 'react'
import { EApprovalStatus } from '@type/chat'

export const useApproval = () => {
  const [states, setStates] = useState<Record<string, EApprovalStatus>>({})

  const approvalMap = useMemo(() => new Map(Object.entries(states)), [states])

  const approve = (toolCallId: string) =>
    setStates((prev) => ({ ...prev, [toolCallId]: EApprovalStatus.ACCEPTED }))

  const reject = (toolCallId: string) =>
    setStates((prev) => ({ ...prev, [toolCallId]: EApprovalStatus.REJECTED }))

  const getStatus = (toolCallId: string): EApprovalStatus =>
    approvalMap.get(toolCallId) ?? EApprovalStatus.PENDING

  return { approve, reject, getStatus }
}
