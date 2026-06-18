'use client'
import { createRoot } from 'react-dom/client'
import UserProfileCard from '@components/dashboard/user/info/usercard'
import { authClient } from '@lib/auth-client'
import { DashboardPage } from '@components/dashboard/business/dashboard'
import { useEffect } from 'react'
import { themeChange } from 'theme-change'
import NavBar from '@components/auxilliary/navbar'
import Recojob from './user/info/recojob'
import ResumeUpload from '@components/dashboard/user/upload/ResumeUpload'
import { ResumeDownload } from '@components/dashboard/user/info/downloadresume'
import AccessibilityWidget from '@components/auxilliary/accessability'

function App() {
    useEffect(() => {
        themeChange(false)
    }, [])
    const { data: session, isPending } = authClient.useSession();
    if (!isPending) {
        if (!session?.user ) {
            window.location.href = "signin.html"
            return (
                <><p> You are not logged in! </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
            )
        }
        else if (session.user.role === "admin") {
            window.location.href = "admin.html"
        }
        else if (session.user.role === "user") {
            return (
                <main>
                    <NavBar />
                    <div className="flex gap-4 items-start mb-4">
                        <UserProfileCard />
                        <Recojob />
                    </div>
                    <ResumeUpload />
                    <ResumeDownload />
                    <AccessibilityWidget />
                </main>
            )
        }
        else if (session.user.role === "business") {
            return (
                <main>
                    <NavBar />
                    <DashboardPage />
                </main>
            )
        }
    }
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)