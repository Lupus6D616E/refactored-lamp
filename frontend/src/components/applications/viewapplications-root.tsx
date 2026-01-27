'use client'
import { createRoot } from 'react-dom/client'
import { DashboardPage } from './dashboard'
import { authClient } from '@lib/auth-client';
function App() {
    const { data: session, isPending } = authClient.useSession();
    if (!session?.user) {
        return (
            <><p> You are not logged in! </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
        )
    }
    else if(session.user.role === "user"){
    return (
        <p>this is a page for businesses to view job applications, scram!</p>
    )
    }
    else if(session.user.role === "business"){
    return (
        <main>
            <DashboardPage />
        </main>
    )
    }
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)