'use client'

import { useCallback, useState } from 'react'

import { EApprovalStatus } from '@type'

export const useApproval = () => {
  const [states, setStates] = useState<Record<string, EApprovalStatus>>({})

  const approve = useCallback(
    (toolCallId: string) =>
      setStates((prev) => ({ ...prev, [toolCallId]: EApprovalStatus.ACCEPTED })),
    [],
  )

  const reject = useCallback(
    (toolCallId: string) =>
      setStates((prev) => ({ ...prev, [toolCallId]: EApprovalStatus.REJECTED })),
    [],
  )

  const getStatus = useCallback(
    (toolCallId: string): EApprovalStatus => states[toolCallId] ?? EApprovalStatus.PENDING,
    [states],
  )

  return { approve, reject, getStatus }
}
