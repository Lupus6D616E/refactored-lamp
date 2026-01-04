'use client'
import { createRoot } from 'react-dom/client'
import  UserProfileCard  from '@components/dashboard/info/usercard'
import LogoutButton from '@components/auth/logout'
import ResumeUpload from '@components/dashboard/upload/ResumeUpload'
import { ResumeDownload } from '@components/dashboard/info/downloadresume'
import { authClient } from '@lib/auth-client'; 
import UpdateProfileCard from '@components/dashboard/upload/updateinfo'
import AddCertificationCard from '@components/dashboard/upload/addcertification'
import CertificationList from '@components/dashboard/info/certificationlist-parent'
import AddExperienceCard from '@components/dashboard/upload/addexperience'
import ExperienceList from '@components/dashboard/info/experiencelist-parent'

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
            <ResumeDownload />
            <UpdateProfileCard />
            <AddCertificationCard />
            <CertificationList />
            <AddExperienceCard />
            <ExperienceList />
        </main>
    )
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)