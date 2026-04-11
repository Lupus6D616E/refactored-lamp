'use client'
import { createRoot } from 'react-dom/client'
import  UserProfileCard  from '@components/dashboard/user/info/usercard'
import LogoutButton from 'frontend/src/components/auth/logout'
import ResumeUpload from '@components/dashboard/user/upload/ResumeUpload'
import { ResumeDownload } from '@components/dashboard/user/info/downloadresume'
import { authClient } from 'backend/src/lib/auth-client'
import AddCertificationCard from '@components/dashboard/user/upload/addcertification'
import CertificationList from '@components/dashboard/user/info/certificationlist-parent'
import AddExperienceCard from '@components/dashboard/user/upload/addexperience'
import ExperienceList from '@components/dashboard/user/info/experiencelist-parent'
import {UpdateProfile} from '@components/dashboard/user/upload/updateprofile'
import { ApplicationList } from '@components/dashboard/user/info/seekerapplications'
import { DashboardPage } from '@components/dashboard/business/dashboard'
import { MessageList } from '@components/dashboard/user/info/messages'
import { useEffect } from 'react'
import { themeChange } from 'theme-change'
import ThemeSwitcherCard from '@components/auxilliary/ThemesSwitcherCard'
import NavBar from '@components/auxilliary/navbar'
function App() {
    useEffect(() => {
  themeChange(false)
}, []) 
    const { data: session, isPending } = authClient.useSession();
    if (!session?.user) {
        return (
            <><p> You are not logged in! </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
        )
    }
    else if(session.user.role === "user"){
    return (
        <main>
            <NavBar />
            <ThemeSwitcherCard />
            <UserProfileCard />
            <LogoutButton />
            <ResumeUpload />
            <ResumeDownload />
            <AddCertificationCard />
            <CertificationList />
            <AddExperienceCard />
            <ExperienceList />
            <UpdateProfile />
            <ApplicationList />
            <MessageList />
        </main>
    )
    }
    else if(session.user.role === "business"){
    return (
        <main>
            <NavBar />
            <DashboardPage />
        </main>
    )
    }
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)