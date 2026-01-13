'use client'
import { createRoot } from 'react-dom/client'
import { authClient } from 'backend/src/lib/auth-client'; 
import{ AdvancedSearchBar} from '@components/search/searchjobbar';

function App() {
    const { data: session, isPending } = authClient.useSession();
    if (!session?.user) {
        return (
            <><p> You are not logged in! </p><p> <a href='/public/signin.html'>Return to Sign-In</a></p></>
        )
    }
    return (
        <main>
            <div className="min-h-screen bg-base-200 py-12">
                <AdvancedSearchBar />
            </div>
        </main>
    )
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)