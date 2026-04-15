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

export type TTaskPayload = {
  title: string
  description: string
  dueDate: string
  priority: string
}

export type TToolCallState = {
  toolCallId: string
  status: EApprovalStatus
  payload: TEventPayload | TEmailPayload | TTaskPayload
}
