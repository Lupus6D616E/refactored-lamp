'use client'
import { createRoot } from 'react-dom/client'
import UserProfileCard  from 'frontend/src/components/dashboard/info/usercard'
import LogoutButton from 'frontend/src/components/auth/logout'
import { authClient } from 'backend/src/lib/auth-client'; 


function App() {
    const { data: session, isPending } = authClient.useSession();
    if (!session?.user) {
        return (
            <><p> You are not logged in! </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
        )
    }
    if (session.user.role != 'business') {
        return (
            <><p> you are not a business </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
        )
    }
    return (
        <main>
            <UserProfileCard />
            <LogoutButton />
        </main>
    )
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)