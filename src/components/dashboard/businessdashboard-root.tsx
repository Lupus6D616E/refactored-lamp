'use client'
import { createRoot } from 'react-dom/client'
import  UserProfileCard  from '@components/dashboard/usercard'
import LogoutButton from '@components/auth/logout'
import ResumeUpload from '@components/dashboard/ResumeUpload'
import { ResumeDownload } from '@components/dashboard/downloadresume'
import { authClient } from '@lib/auth-client'; 


function App() {
    const { data: session, isPending } = authClient.useSession();
    if (!session?.user) {
        return (
            <><p> You are not logged in! </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
        )
    }
    if (session.user.role != 'business') {
        return (
            <><p> you are not an admin </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
        )
    }
    return (
        <main>
            <UserProfileCard />
            <LogoutButton />
            <ResumeUpload />
            <ResumeDownload />
        </main>
    )
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)