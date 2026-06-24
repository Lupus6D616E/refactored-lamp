// DashboardNavbar.tsx
import LogoutButton from "@components/auth/logout"
import { BusinessSelect } from "./types"
import ThemeSwitcherCard from "@components/auxilliary/ThemesSwitcherCard"

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
    <div className="navbar bg-base-200 shadow">
      <div className="flex-1">
          <a href="/public/dashboard.html" className="text-3xl font-black font-brand tracking-tighter bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
            FlexiHire</a>
            <a href="/public/dashboard.html" className="ml-2 font-normal-case text-xl ml-4">
             Business Dashboard
          </a>
        </div>

        <button className="btn btn-ghost mr-4">
          <a href="/public/createjob.html" className="w-full h-full flex items-center">
          <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth="2.5" 
    stroke="currentColor" 
    className="w-4 h-4"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>Create Post</a>
        </button>

      <div className="flex-none">
  {loading ? (
    <div className="skeleton h-10 w-40" />
  ) : (
    
    <div className="dropdown dropdown-end">
      <div 
        tabIndex={0} 
        role="button" 
        className="select select-bordered flex items-center justify-between min-w-[160px]"
      >
        {dashboards.find((d) => d.id === selectedId)?.name || "Menu"}
      </div>

      <ul 
        tabIndex={0} 
        className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-56 z-[1] mt-1 border border-base-200"
      >
        {dashboards.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              className={`justify-between ${selectedId === d.id ? "active" : ""}`}
              onClick={() => {
                onChange(d.id);
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }}
            >
              {d.name}
            </button>
          </li>
        ))}
        <li className="text-error font-semibold w-full">
          <LogoutButton />
        </li>

      </ul>
    </div>
  )}
</div>

    </div>
  )
}
