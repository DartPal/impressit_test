'use client'

import { Button, Input, TextField } from '@heroui/react'
import { useRef } from 'react'
import type { FormEvent } from 'react'

interface IProps {
  input: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="18" height="18">
    <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
  </svg>
)

export const ChatInput = ({ input, isLoading, onInputChange, onSubmit }: IProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    onSubmit(e)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

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
