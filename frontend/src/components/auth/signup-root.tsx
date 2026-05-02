import { createRoot } from "react-dom/client";
import { SignupCard } from "@components/auth/signupform";

function App() {
  return (
<main>
  <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Quicksand:wght@400;600&display=swap');
        
        .font-brand { font-family: 'Montserrat', sans-serif; }
        .font-body { font-family: 'Quicksand', sans-serif; }
      `}</style>

      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
        <div className="flex-1">
         <a href="/public" className="text-3xl font-black font-brand tracking-tighter bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
            FlexiHire
         </a>
        </div>
    </div>
      
  <div className="hero bg-base-200 min-h-screen">
    <div className="hero-content flex-col lg:flex-row w-full max-w-5xl gap-0">
      
      <div className="hidden lg:flex lg:w-1/2 justify-center lg:justify-end">
        <figure className="rounded-lg">
          <img
            src="/static/images/assets/signup.png" 
            alt="FlexiHire Illustration"
            className="w-full max-w-sm h-auto object-contain"
          />
        </figure>
      </div>

      <div className="w-89 lg:w-1/2 flex lg:justify-start">
        <SignupCard />
      </div>

    </div>
  </div>
</main>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
