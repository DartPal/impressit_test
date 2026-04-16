'use client'

import { Text } from '@heroui/react'

import type { TEventPayload } from '@type'
import { formatDate } from '@utils'

interface IProps {
  payload: TEventPayload
}

export const EventContent = ({ payload }: IProps) => (
  <>
    <Text size="sm" className="font-medium text-[#ececec]">
      {payload.title}
    </Text>
    <Text size="xs" variant="muted">
      {formatDate(payload.date)}
    </Text>
    <Text size="xs" variant="muted">
      {payload.duration} minutes
    </Text>
  </>
)
