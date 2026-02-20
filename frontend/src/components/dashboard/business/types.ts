export interface BusinessSelect {
  id: string
  name: string | null
}

export interface JobPostData {
  info: {
    id: number
    title: string
    status: string | number
    applications: number
  }[]
}

export interface MessageData {
  info: {
    id: number
    subject: string
    name: string | null
    date: Date
    senderRole:string
  }[]
}