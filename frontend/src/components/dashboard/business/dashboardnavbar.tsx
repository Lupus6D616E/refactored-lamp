// DashboardNavbar.tsx
import { BusinessSelect } from "./types"

interface Props {
  dashboards: BusinessSelect[]
  selectedId?: string
  onChange: (id: string) => void
  loading: boolean
}

export const DashboardNavbar = ({
  dashboards,
  selectedId,
  onChange,
  loading,
}: Props) => {
  return (
    <div className="navbar bg-base-100 shadow">
      <div className="flex-1 px-2 font-bold text-lg">
        My Dashboard
      </div>

      <div className="flex-none">
        {loading ? (
          <div className="skeleton h-10 w-40" />
        ) : (
          <select
            className="select select-bordered"
            value={selectedId}
            onChange={(e) => onChange(e.target.value)}
          >
            {dashboards.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}
