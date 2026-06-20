// DashboardCards.tsx
import { useState } from "react"
import { JobPostData } from "./types"
import { edenTreatyApi } from "@lib/eden"

interface Props {
  data?: JobPostData
  loading: boolean
}

export const JobPostCards = ({ data, loading }: Props) => {

     const [message, setMessage] = useState('')
      const [error, setError] = useState('')
      const [isSubmitting, setSubmitting] = useState(false)
        const handleDecision = async (jobId:number) => {
          setSubmitting(true)

        setError('')
        const payload = {
            id: jobId
        }
        try {
          await edenTreatyApi.business.markfilled.post(payload)
          setMessage('') // reset after success
          setSubmitting(false)
        } catch (err) {
          setError('Failed to send decision. Try again.')
          console.error(err)
          setSubmitting(false)
        }
      }
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
              {stat.status}
            </h2>
            <h2 className="badge badge-secondary">
              Applications: {stat.applications}
            </h2>
            <p className="text-3xl font-bold">
              {stat.title}
            </p>
            <a  className="btn btn-lg" href={`viewpost.html?id=${stat.id}`} > Go to post </a>
            <a  className="btn btn-lg" href={`viewapplications.html?id=${stat.id}`} > Go to Applications </a>
            {(stat.status === "active") &&<button onClick={() => handleDecision(stat.id!)} className="btn btn-lg">
              Mark Filled
            </button>}
            {isSubmitting && <p>Marking.....</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
