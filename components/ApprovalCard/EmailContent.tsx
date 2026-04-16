'use client'

import { Text } from '@heroui/react'

import type { TEmailPayload } from '@type'

interface IProps {
  payload: TEmailPayload
}

export const EmailContent = ({ payload }: IProps) => (
  <>
    <Text size="xs" variant="muted">
      To: <span className="text-[#ececec]">{payload.to}</span>
    </Text>
    <Text size="xs" variant="muted">
      Subject: <span className="text-[#ececec] font-medium">{payload.subject}</span>
    </Text>
    <Text
      size="xs"
      variant="muted"
      className="mt-1 whitespace-pre-wrap break-words border-t border-white/10 pt-2"
    >
      {payload.body}
    </Text>
  </>
)
