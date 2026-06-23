'use client'
import { createRoot } from 'react-dom/client'
import { DashboardPage } from './dashboard'
import { authClient } from '@lib/auth-client';
import { themeChange } from 'theme-change'
import { ApplyTheme } from '@components/auxilliary/ApplyTheme';


function App() {
    const { data: session, isPending } = authClient.useSession();
    if (!session?.user) {
        return (
            <><p> You are not logged in! </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
        )
    }
    else if(session.user.role === "user"){
    return (
        <p>This is a page for businesses to view job applications, scram!</p>
    )
    }
    else if(session.user.role === "business"){
    return (
        
        <main>
            <ApplyTheme/>
            <DashboardPage />
        </main>
    )
    }
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)