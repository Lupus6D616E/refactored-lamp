export interface DashboardInfo {
  id: string
  name: string | null
}

export interface DashboardData {
  info: {
    id: string |null
    name: string|null
    email: string|null
  }[]
}