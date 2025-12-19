'use client'
import { createRoot } from 'react-dom/client'
import  UserProfileCard  from '@components/usercard'
import LogoutButton from '@components/logout'
import ResumeUpload from '@components/ResumeUpload'
import { authClient } from '@lib/auth-client'; 

function App() {
    const { data: session, isPending } = authClient.useSession();
    if (!session?.user) {
        return (
            <><p> You are not logged in! </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
        )
    }
    return (
        <main>
            <UserProfileCard />
            <LogoutButton />
            <ResumeUpload />
        </main>
    )
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)