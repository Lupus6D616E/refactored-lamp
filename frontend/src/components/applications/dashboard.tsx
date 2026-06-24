// DashboardPage.tsx
import { useEffect, useState } from "react";
import { DashboardCards } from "./dashboardcards";
import { DashboardData } from "./types";
import { edenTreatyApi } from "@lib/eden";
import { DashboardNavbar } from "@components/dashboard/business/dashboardnavbar";

export function DashboardPage() {
  const [selectedId, setSelectedId] = useState<string>();
  const [data, setData] = useState<DashboardData>();
  const [loadingData, setLoadingData] = useState(false);


  // Load Applicants
  useEffect(() => {
     const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    let idParam = "0";
    if(params.get("id") !== null){
    idParam = params.get("id")!
    }
    setLoadingData(true);
    const fetchapplications = async () => {
      const res = await edenTreatyApi.business
        .viewapplications({ id: idParam })
        .get();
      if (res.data) {
        const data = {
          title: res.data.title,
          jobId: parseInt(idParam),
          info: res.data.applications,
        };
        setData(data);
      }
      setLoadingData(false);
    };
    fetchapplications();
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-base-200">
      <DashboardNavbar dashboards={[]} onChange={() => {}} loading={false} />
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
      <main className="p-6">
        
        <div className="card w-min-screen bg-base-300 card-sm shadow-md">
          <div className="card-body">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-black ">
              Applications for <span className="text-blue-600">{data?.title}</span>
            </h2>
            <DashboardCards data={data} loading={loadingData} />
          </div>
        </div>
      </main>
    </div>
  </div>
  );
}
