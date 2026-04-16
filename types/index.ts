export enum EApprovalStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export type TEventPayload = {
  title: string
  date: string
  duration: number
}

export type TEmailPayload = {
  to: string
  subject: string
  body: string
}

export type TToolCallState = {
  toolCallId: string
  status: EApprovalStatus
  payload: TEventPayload | TEmailPayload
}

type TAcceptHandler = (
  tool: string,
  toolCallId: string,
  payload: TEventPayload | TEmailPayload,
) => void

export type TEventVariant = {
  tool: 'scheduleEvent'
  payload: TEventPayload
  onAccept: TAcceptHandler
}

export type TEmailVariant = {
  tool: 'sendEmail'
  payload: TEmailPayload
  onAccept: TAcceptHandler
}

export type TScheduleEventPart = {
  type: 'tool-scheduleEvent'
  toolCallId: string
  state: string
  input: TEventPayload
}

export type TSendEmailPart = {
  type: 'tool-sendEmail'
  toolCallId: string
  state: string
  input: TEmailPayload
}
