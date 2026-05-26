import { authClient } from "@lib/auth-client";
import { ApplyTheme } from "./ApplyTheme"
import LogoutButton from "@components/auth/logout";
import { useEffect, useState } from "react";
import { edenTreatyApi } from "@lib/eden";
import ThemeSwitcherCard from "./ThemesSwitcherCard";
interface NotificationResponse {

  id: number;
  type: string;
  title: string | null;
  message: string;
  createdAt: Date;

}

export default function NavBar() {
  const { data: session, isPending } = authClient.useSession();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([])
  useEffect(() => {
    const fetchnotifications = async () => {
      try {
        const res = await edenTreatyApi.notifications.mynotifications.get()
        if (res.data) {
          setNotifications(res.data)
        }
        else {
          throw new Error("failed to fetch notifications")
        }
      }
      catch (e) {
        console.log(e)
      }
    }
    fetchnotifications()
  }, [])
  async function markread(id:number){
   const res =  await edenTreatyApi.notifications.markread({id:id}).get()
  }
  
  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
      <ApplyTheme />
      <div className="flex-1">
        <a className="text-3xl font-black font-brand tracking-tighter bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
            FlexiHire
          </a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li><a href="search.html">Search</a></li>
          <li>
            {/* change popover-1 and --anchor-1 names. Use unique names for each dropdown */}
            {/* For TSX uncomment the commented types below */}
            <button popoverTarget="popover-1" style={{ anchorName: "--anchor-1" } /* as React.CSSProperties */}>
              Notifications
            </button>
            <ul className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
              popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" } /* as React.CSSProperties */}>
              {notifications.map((item) => (
                <li key={item.id}>
                  <details className="collapse bg-base-100 border border-base-300" name="my-accordion-det-1" open>
                    <summary className="collapse-title font-semibold">{item.title}</summary>
                    <div className="collapse-content text-sm">{item.message}</div>

                  <button className="btn" onClick={() => {markread(item.id)}}> mark as read</button>
                  </details>
                </li>
              ))} 
            </ul>
          </li>
          <li>
            <details>
              <summary>{session?.user.name}</summary>
              <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-50 p-1 shadow-sm">
                <li><a>Settings</a></li>
                <li><ThemeSwitcherCard/></li>
                <li><LogoutButton /></li>
              </ul>
            </details>
          </li>

        </ul>
      </div>
    </div>
  )
}