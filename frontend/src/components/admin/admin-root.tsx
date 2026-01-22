'use client'
import { authClient } from '@lib/auth-client';
import { createRoot } from 'react-dom/client'
import { BootstrapCard } from './bootstrapcard';
import { AdminDashboard } from './dashboard';

function App() {
    const { data: session, isPending } = authClient.useSession();
    if (!session?.user) {
        return (
        <main>
     <div className="hero bg-base-200 min-h-screen">
                    <div className="hero-content flex-col lg:flex-row-reverse">
                        <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold">Admin bootstrapper!</h1>
                        <p className="py-6">
                            Go away if you don't have the secret key
                        </p>
                        </div>
                        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                            <div className="card-body">
                                <BootstrapCard />
                            </div>
                            </div>
                    </div>
                </div>
        </main>
        )
    }
    else if(session.user.role === "user"){
    return (
        <main>
            nice try
        </main>
    )
    }
    else if(session.user.role === "business"){
    return (
        <main>
             <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <div className="card-body">
                            return to business dashboard: 
                                    <button className='btn' onClick={() => window.location.href = '/user-dashboard  '}>Go Home</button>
                        </div>
            </div>
        </main>
    )
    }
    else if(session.user.role === "admin"){
        return(
            <AdminDashboard />
        )
    }
    
}   

const root = createRoot(document.getElementById('root')!)
root.render(<App />)