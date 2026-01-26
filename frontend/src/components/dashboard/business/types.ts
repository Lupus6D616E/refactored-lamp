export interface DashboardInfo {
  id: string
  name: string | null
}

export interface DashboardData {
  info: {
    id: number
    title: string
    status: string | number
  }[]
}