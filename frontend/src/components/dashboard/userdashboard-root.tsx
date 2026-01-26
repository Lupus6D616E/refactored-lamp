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
import { ApplicationList } from './user/info/seekerapplications'
function App() {
    const { data: session, isPending } = authClient.useSession();
    if (!session?.user) {
        return (
            <><p> You are not logged in! </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
        )
    }
    else if(session.user.role === "user"){
    return (
        <main>
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
        </main>
    )
    }
    else if(session.user.role === "business"){
    return (
        <main>
            <UserProfileCard />
            <LogoutButton />
             <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                        </div>
            </div>
        </main>
    )
    }
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)