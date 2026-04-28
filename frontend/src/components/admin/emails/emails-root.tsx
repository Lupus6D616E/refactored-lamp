'use client'
import { authClient } from '@lib/auth-client';
import { createRoot } from 'react-dom/client'
import { ForbiddenPage } from '@components/auxilliary/Forbidden';
import EmailInbox from './emailpage';


function App() {
    const { data: session, isPending } = authClient.useSession();
  if(session?.user.role === "admin"){
        return(
            <EmailInbox />
        )
    }
    else{
        return(
            <ForbiddenPage />
        )
    }
    
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)