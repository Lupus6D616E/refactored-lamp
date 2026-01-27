// DashboardCards.tsx
import { DashboardData } from "./types"

interface Props {
  data?: DashboardData
  loading: boolean
}

export const DashboardCards = ({ data, loading }: Props) => {
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
              {stat.email}
            </h2>
            <p className="text-3xl font-bold">
              {stat.name}
            </p>
            <a  className="btn btn-lg" href={`userprofile.html?id=${stat.id}`} > Go to profile </a>
          </div>
        </div>
      ))}
    </div>
  )
}
