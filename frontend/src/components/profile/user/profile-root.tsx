import { createRoot } from "react-dom/client";
import { UserProfile } from "./profile";
import React from "react";

const ApplyTheme = () => null;

function App() {
  // Kinukuha ang 'id' mula sa URL, kung wala ay magiging null/empty string
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id") || ""; 

  return (
    <main >
      <div className="navbar bg-base-200 shadow-sm sticky top-0 z-50">
              <ApplyTheme />
              <div className="flex-1">
                <a href="/public/dashboard.html" className="text-3xl font-black font-brand tracking-tighter bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
                  FlexiHire
                </a>
              </div>
    
            </div>
        <div className="bg-base-200 min-h-screen py-5">
            <UserProfile id={userId} /> 
        </div>   
    </main>
  );
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}