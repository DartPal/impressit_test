'use client'

import { Button, Input, TextField } from '@heroui/react'
import { useCallback, useRef } from 'react'
import type { FormEvent } from 'react'

import { SendIcon } from '@icons/SendIcon'

interface IProps {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

export const ChatInput = ({ input, isLoading, onInputChange, onSubmit }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      onSubmit(e)
      requestAnimationFrame(() => inputRef.current?.focus())
    },
    [onSubmit],
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 px-4 py-4 pb-6 border-t border-white/10 bg-[#212121]"
    >
      <TextField className="flex-1" isDisabled={isLoading}>
        <Input
          ref={inputRef}
          value={input}
          onChange={onInputChange}
          placeholder="Type a message..."
          className="w-full px-4 py-2.5 rounded-2xl border border-white/10 bg-[#2f2f2f] text-[#ececec] text-sm focus:outline-none focus:ring-2 focus:ring-[#8e8ea0] placeholder-[#8e8ea0]"
        />
      </TextField>
      <Button
        type="submit"
        isDisabled={isLoading || !input.trim()}
        variant="outline"
        className="w-10 h-10 min-w-0 p-0 flex items-center justify-center rounded-2xl bg-[#565869] border-0 hover:bg-[#6b6c7e] disabled:opacity-40 shrink-0"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : (
          <SendIcon />
        )}
      </Button>
    </form>
  )
}
