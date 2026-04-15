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

export type TToolCallState = {
  toolCallId: string
  status: EApprovalStatus
  payload: TEventPayload
}
