import { authClient } from "@lib/auth-client";
import { ApplyTheme } from "./ApplyTheme"
import LogoutButton from "@components/auth/logout";

export default function NavBar() {
    const { data: session, isPending } = authClient.useSession();

  return (
<div className="navbar bg-base-100 shadow-sm">
  <ApplyTheme />
  <div className="flex-1">
    <a className="btn btn-ghost text-xl" href={"public/index.html"}>daisyUI</a>
  </div>
  <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
      <li><a href="search.html">Search</a></li>
      <li>
        <details>
          <summary>{session?.user.name}</summary>
          <ul className="bg-base-100 rounded-t-none p-2">
            <li><a>Settings</a></li>
            <li><LogoutButton /></li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</div>
  )
}