"use client";
import { createRoot } from "react-dom/client";
import { authClient } from "@lib/auth-client";
import { AdvancedSearchBar } from "@components/search/searchjobbar";
import { useState } from "react";
import { SearchResult } from "./types";
import ResultsList from "./results";
import { ApplyTheme } from "@components/auxilliary/ApplyTheme";
import NavBar from '@components/auxilliary/navbar';
import AccessibilityWidget from "@components/auxilliary/accessability";


function App() {

  const [results, setResults] = useState<SearchResult[]>([]);
  const { data: session, isPending } = authClient.useSession();
  if (!session?.user && !isPending) {
    return (
      <>
      
        <p> You are not logged in! </p>
        <p>
          {" "}
          <a href="/public/signin.html">Return to Sign-In</a>
        </p>
      </>
    );
  }
  
  return (
    <main>
      <NavBar />
      <ApplyTheme />
      
      <div className="min-h-screen bg-base-200">
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 items-center gap-2">
            <li>
              <button 
                 onClick={() => window.history.back()} 
                 className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 transition-all duration-200 group"
                >
               <svg 
                 xmlns="http://www.w3.org/2000/svg" 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 strokeWidth={2.5} 
                 stroke="currentColor" 
                 className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
               >
               <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
               </svg>
               <span className="font-medium">Back</span>
              </button>
            </li>
          </ul>
      </div>
        
        <AdvancedSearchBar onResults={setResults} />
        <ResultsList results={results} />
      </div>
      <AccessibilityWidget />
    </main>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
