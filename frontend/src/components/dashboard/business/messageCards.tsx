// DashboardCards.tsx
import { useState } from "react"
import { MessageData } from "./types"

interface Props {
  data?: MessageData
  businessId?: string
  loading: boolean
}

export const MessageCards = ({ data, loading, businessId }: Props) => {

     const [message, setMessage] = useState('')
      const [error, setError] = useState('')
      const [isSubmitting, setSubmitting] = useState(false)
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow">
            <div className="card-body space-y-3">
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-8 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data?.info.map((stat, i) => (
        <div key={i} className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="badge badge-secondary">
              {stat.subject}
            </h2>
            <h2 className="badge badge-secondary">
              Name: {stat.name}
            </h2>
            <h2 className="badge badge-secondary">
              Name: {stat.senderRole}
            </h2>
            <p className="text-3xl font-bold">
              {stat.date.toDateString()}
            </p>
            {businessId ? <a className="btn btn-lg" href={`viewmail.html?id=${stat.id}&businessId=${businessId}`} > Go to post </a> : <a  className="btn btn-lg" href={`viewmail.html?id=${stat.id}`} > Go to post </a>  }
          </div>
        </div>
      ))}
    </div>
  )
}
