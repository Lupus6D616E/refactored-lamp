// DashboardPage.tsx
import { useEffect, useState } from "react";
import { DashboardCards } from "./dashboardcards";
import { DashboardData, DashboardInfo } from "./types";
import { edenTreatyApi } from "@lib/eden";

export function DashboardPage() {
  const [dashboards, setDashboards] = useState<DashboardInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [data, setData] = useState<DashboardData>();
  const [loadingDashboards, setLoadingDashboards] = useState(true);
  const [loadingData, setLoadingData] = useState(false);


  // Load Job Applications
  useEffect(() => {
     const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    let idParam = "0";
    if(params.get("id") !== null){
    idParam = params.get("id")!
    }
    setLoadingData(true);
    const fetchJobPosts = async () => {
      const res = await edenTreatyApi.business
        .viewapplications({ id: idParam })
        .get();
      if (res.data) {
        const data = {
          info: res.data,
        };
        setData(data);
      }
      setLoadingData(false);
    };
    fetchJobPosts();
  }, [selectedId]);

  return (
    <div className="min-h-screen bg-base-200">

      <main className="p-6">
        <div className="card w-min-screen bg-base-300 card-sm shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Applications for</h2>
            <DashboardCards data={data} loading={loadingData} />
          </div>
        </div>
      </main>
    </div>
  );
}
