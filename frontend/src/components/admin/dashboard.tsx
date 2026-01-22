// components/AdminDashboard.tsx
import { useEffect, useState } from "react"
import SearchUserCard from "./searchuser"

export interface AdminStats {
  users: number
  orders: number
  revenue: number
  uptime: string
}

export const mockAdminData: AdminStats = {
  users: 1280,
  orders: 342,
  revenue: 45230,
  uptime: "99.9%",
}

export function AdminDashboard() {
  const [data, setData] = useState<AdminStats>(mockAdminData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch("/api/admin")

        if (!res.ok) {
          throw new Error("Failed to fetch admin data")
        }

        const realData: AdminStats = await res.json()
        setData(realData)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow">
        <div className="flex-1">
          <span className="text-xl font-bold">Admin Dashboard</span>
        </div>
        <div className="flex-none">
          {loading && <span className="loading loading-spinner loading-sm" />}
        </div>
      </div>

      {/* Content */}
      <main className="p-6">
        {error && (
          <div className="alert alert-error mb-6">
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Users" value={data.users} />
          <StatCard title="Orders" value={data.orders} />
          <StatCard title="Revenue" value={`$${data.revenue.toLocaleString()}`} />
          <StatCard title="Uptime" value={data.uptime} />
          <SearchUserCard />
        </div>
      </main>
    </div>
  )
}

function StatCard({
  title,
  value,
}: {
  title: string
  value: string | number
}) {
  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        <h2 className="card-title text-sm opacity-70">{title}</h2>
        <p className="text-3xl font-bold">{value}</p>
      </div>
    </div>
  )
}
