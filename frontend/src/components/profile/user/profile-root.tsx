import { createRoot } from "react-dom/client";
import { UserProfile } from "./profile";
import React from "react";
import NavBar from '@components/auxilliary/navbar'
import ResumeUpload from '@components/dashboard/user/upload/ResumeUpload'
import { ResumeDownload } from '@components/dashboard/user/info/downloadresume'


function App() {
  // Kinukuha ang 'id' mula sa URL, kung wala ay magiging null/empty string
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("id") || ""; 

  return (
    <main >
      <NavBar />
        <div className="bg-base-200 min-h-screen py-5">
            <UserProfile id={userId} /> 
            <ResumeUpload />
            <ResumeDownload />
        </div>
      
    </main>
  );
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}