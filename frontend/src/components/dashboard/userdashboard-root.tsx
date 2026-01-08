'use client'
import { createRoot } from 'react-dom/client'
import  UserProfileCard  from 'frontend/src/components/dashboard/info/usercard'
import LogoutButton from 'frontend/src/components/auth/logout'
import ResumeUpload from 'frontend/src/components/dashboard/upload/ResumeUpload'
import { ResumeDownload } from 'frontend/src/components/dashboard/info/downloadresume'
import { authClient } from '@lib/auth-client'; 
import UpdateProfileCard from 'frontend/src/components/dashboard/upload/updateinfo'
import AddCertificationCard from 'frontend/src/components/dashboard/upload/addcertification'
import CertificationList from 'frontend/src/components/dashboard/info/certificationlist-parent'
import AddExperienceCard from 'frontend/src/components/dashboard/upload/addexperience'
import ExperienceList from 'frontend/src/components/dashboard/info/experiencelist-parent'

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