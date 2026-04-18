import { createRoot } from "react-dom/client";
import { SigninForm } from "frontend/src/components/auth/signinform";

function App() {
  return (
    <main>
      <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
          <div className="flex-1">
              <a className="text-3xl font-bold bg-gradient-to-r from-[#0038a8] to-[#00ced1] bg-clip-text text-transparent cursor-pointer">
                FlexiHire
              </a>
          </div>
      </div>

  

      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Sign in now!</h1>
            <p className="py-6">Get access to many helpful features!</p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <SigninForm />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
