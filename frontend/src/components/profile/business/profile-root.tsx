import { createRoot } from "react-dom/client";
import UserProfile from "./profile";
import NavBar from "@components/auxilliary/navbar";
import AccessibilityWidget from "@components/auxilliary/accessability";

function App() {
  return (
    <main>
        <NavBar />
        <div className="min-h-screen bg-base-200">
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
        <UserProfile id={getPostId()} /> 
        </div>
        <AccessibilityWidget />
    </main>
  );
}

function getPostId() {
  const params = new URLSearchParams(window.location.search);
    return params.get("id")!;
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
