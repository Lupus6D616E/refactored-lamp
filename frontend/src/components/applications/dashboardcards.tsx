// DashboardCards.tsx
import { useState } from "react";
import { DashboardData, DecisionPayload } from "./types";
import { edenTreatyApi } from "@lib/eden";

interface Props {
  data?: DashboardData;
  loading: boolean;
}

export const DashboardCards = ({ data, loading }: Props) => {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)
    const handleDecision = async (userId:string,action: 'accepted' | 'rejected' | "pending") => {
      setSubmitting(true)
    if (!message.trim()) {
      setError('Message is required')
      setSubmitting(false)
      return
    }

    setError('')
    const payload: DecisionPayload = {
      userId: userId,
      jobId: data!.jobId,
      message: message.trim(),
      decision: action,
    }

    try {
      await edenTreatyApi.business.decideapplication.post(payload)
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
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data?.info.map((stat, i) => (
        <div key={i} className="card bg-base-100 shadow">
          <div className="card-body">
            <h2 className="badge badge-secondary">{stat.email}</h2>
            <h2 className="badge badge-secondary">{stat.status}</h2>
            <p className="text-3xl font-bold">{stat.name}</p>
            <a className="btn btn-lg" href={`userprofile.html?id=${stat.id}`}>
              Go to profile
            </a>
            <textarea
            className={`textarea textarea-bordered w-full min-h-[80px] ${
              error ? 'textarea-error' : ''
            }`}
            placeholder="Required message / reason..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              if (error) setError('')
            }}
            disabled={isSubmitting}
          />
            { error && <p>Error: {error}</p>}
            <button onClick={() => handleDecision(stat.id!,"accepted")} className="btn btn-lg">
              Approve
            </button>
             <button onClick={() => handleDecision(stat.id!,"pending")} className="btn btn-lg">
              Pending
            </button>
            <button onClick={() => handleDecision(stat.id!,"rejected")} className="btn btn-lg">
              Reject
            </button>
           
          </div>
        </div>
      ))}
    </div>
  );
};
