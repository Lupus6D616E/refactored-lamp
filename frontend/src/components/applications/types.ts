export interface DashboardInfo {
  id: string
  name: string | null
}

export interface DashboardData {
  title: string | null
  jobId: number
  info: {
    id: string |null
    name: string|null
    email: string|null
    status: string
  }[]
}
export interface DecisionPayload {
  userId: string
  jobId: number
  message: string
  decision: 'accepted' | 'rejected' | 'pending'
}