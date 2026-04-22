import { createRoot } from "react-dom/client";
import { SigninForm } from "frontend/src/components/auth/signinform";

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
              <a className="text-3xl font-black font-brand tracking-tighter bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
            FlexiHire
          </a>
          </div>
      </div>
      
  <div className="hero bg-base-200 min-h-screen flex items-center justify-center ">
      <div className="hero-content flex-col lg:flex-row-reverse gap-6 border rounded-lg p-8 border-gray-300 shadow-lg max-w-2xl mx-auto bg-white">
  
  <div className="w-full lg:w-1/2">
    <div className="text-center lg:text-left mb-6">
    </div>
    <SigninForm />
  </div>

  <figure className="lg:w-1/2  lg:flex items-center justify-center rounded-lg overflow-hidden">
    <img
      src="/static/images/assets/design.png" 
      alt="FlexiHire Illustration"
      className="w-full max-w-sm h-auto object-contain"
    />
  </figure>

</div>
</div>
    </main>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
