import { createRoot } from "react-dom/client";
import { SignupCard } from "frontend/src/components/auth/signupform";

function App() {
  return (
    <main>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Sign up now!</h1>
            <p className="py-6">Join others in your quest for employment</p>
          </div>
          <SignupCard />
        </div>
      </div>
    </main>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
