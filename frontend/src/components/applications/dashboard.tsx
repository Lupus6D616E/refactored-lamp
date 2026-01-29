// DashboardPage.tsx
import { useEffect, useState } from "react";
import { DashboardCards } from "./dashboardcards";
import { DashboardData } from "./types";
import { edenTreatyApi } from "@lib/eden";

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

      <main className="p-6">
        <div className="card w-min-screen bg-base-300 card-sm shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Applications for {data?.title}</h2>
            <DashboardCards data={data} loading={loadingData} />
          </div>
        </div>
      </main>
    </div>
  );
}
