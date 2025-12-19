
import { createRoot } from 'react-dom/client'
import  UserProfileCard  from '@components/usercard'
import LogoutButton from '@components/logout'
import ResumeUpload from '@components/ResumeUpload'

function App() {
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