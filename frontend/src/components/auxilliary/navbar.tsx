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
  const user = session?.user;
  const userInitial = user?.name?.[0] ?? user?.email?.[0] ?? "U";
  const profileSrc = user?.id ? `/static/images/profilepicture/user/${user.id}` : undefined;
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
  /* 1. Ang main drawer container */
  <div className="drawer drawer-end z-[60]">
    <input id="settings-drawer" type="checkbox" className="drawer-toggle" />
    
    <div className="drawer-content flex flex-col">
      {/* --- START NG NAVBAR (Yung info na binigay mo) --- */}
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        <ApplyTheme />
        <div className="flex-1">
          <a href="/public/dashboard.html" className="text-3xl font-black font-brand tracking-tighter bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
            FlexiHire
          </a>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 items-center">
            <li><a href="/public/dashboard.html">Home</a></li>
            <li><a href="search.html">Search</a></li>
            <li>
              <button popoverTarget="popover-1" style={{ anchorName: "--anchor-1" } as any}>
                Notifications
              </button>

              <ul className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
                popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" } as any}>
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
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar border border-base-200">
                  <div className="w-10 rounded-full bg-neutral text-neutral-content">
                    {!user || user.image === null ? (
                      <div className="flex items-center justify-center h-full w-full">
                        <span className="text-xl uppercase">{userInitial}</span>
                      </div>
                    ) : (
                      <img
                        alt="Profile"
                        src={profileSrc}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.classList.add("placeholder");
                            parent.innerHTML = `<span class="text-xl uppercase">${userInitial}</span>`;
                          }
                        }}
                      />
                    )}
                  </div>
                </div>

                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow border border-base-200">
                  
                  {/* BINAGO: Pinalitan ang <a> ng <label> para bumukas ang drawer */}
                  <li>
                    <label htmlFor="settings-drawer" className="cursor-pointer">
                      Settings
                    </label>
                  </li>
                  
                  <li className="mt-2 pt-2 border-t border-base-200">
                    <LogoutButton />
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* --- END NG NAVBAR --- */}
    </div>

    {/* 2. Eto yung "Drawer Side" na lilitaw pag pinindot ang Settings */}
    <div className="drawer-side">
      <label htmlFor="settings-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      <div className="menu p-6 w-80 min-h-full bg-base-100 text-base-content border-l border-base-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <label htmlFor="settings-drawer" className="btn btn-sm btn-circle btn-ghost">✕</label>
        </div>

        
        <div className="p-4">
          <ThemeSwitcherCard />
        </div>
        
        <div className="mt-auto pt-4 border-t border-base-300">
          <LogoutButton />
        </div>
      </div>
    </div>
  </div>
  );
}