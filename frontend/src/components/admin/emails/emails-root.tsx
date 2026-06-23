'use client'
import { authClient } from '@lib/auth-client';
import { createRoot } from 'react-dom/client'
import { ForbiddenPage } from '@components/auxilliary/Forbidden';
import EmailInbox from './emailpage';
import LogoutButton from "@components/auth/logout";
import { ApplyTheme } from '@components/auxilliary/ApplyTheme';
import AccessibilityWidget from '@components/auxilliary/accessability';

function App() {
    const { data: session, isPending } = authClient.useSession();
  if(session?.user.role === "admin"){
        return(
            <main> 
            <ApplyTheme/>
            <AccessibilityWidget/>
            <div className="min-h-screen bg-base-200">
                  {/* Navbar */}
                  <div className="navbar bg-base-100 shadow">
                    <div className="flex-1">
                      <a href="/public/dashboard.html" className="text-3xl font-black font-brand tracking-tighter bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
                        FlexiHire</a>
                        <a href="/public/dashboard.html" className="ml-2 font-normal-case text-xl ml-4">
                         Admin Dashboard
                      </a>
                    </div>
              
              
              <div className="flex items-center">
                <LogoutButton />
              </div>
            </div>
            <EmailInbox />
            </div>
            </main>
        )
    }
    else{
        return(
            <ForbiddenPage />
        )
    }
    
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)