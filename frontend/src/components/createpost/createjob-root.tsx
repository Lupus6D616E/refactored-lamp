import { createRoot } from "react-dom/client";
import { CreateJobForm } from "@components/createpost/createjob";
import { DashboardNavbar } from "@components/dashboard/business/dashboardnavbar";
import { ApplyTheme } from "@components/auxilliary/ApplyTheme";
import AccessibilityWidget from '@components/auxilliary/accessability'

function App() {
  return (
    <main>
      <ApplyTheme/>
      <DashboardNavbar dashboards={[]} onChange={() => {}} loading={false}/>
      <div className="hero bg-base-200 min-h-screen py-12 px-4">
  <div className="hero-content w-full flex-col gap-10">
    
    <div className="text-center w-full max-w-xl mx-auto">
      <h1 className="text-5xl font-bold tracking-tight text-primary">Create Post</h1>
      <p className="text-base-content/70 text-base">
        Fill out the details to find the best match for your job opening. <br className="hidden sm:block" /> Please note that all fields are required.
      </p>
    </div>

   
    <div className="card bg-base-100 w-full max-w-3xl shrink-0 shadow-2xl border border-base-300">
      <div className="card-body p-6 sm:p-10">
        <CreateJobForm />
      </div>
    </div>

  </div>
</div>
<AccessibilityWidget/>
    </main>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
