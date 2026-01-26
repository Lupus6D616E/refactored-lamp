// DashboardPage.tsx
import { useEffect, useState } from "react";
import { DashboardNavbar } from "./dashboardnavbar";
import { DashboardCards } from "./dashboardcards";
import { DashboardData, DashboardInfo } from "./types";
import { edenTreatyApi } from "@lib/eden";

export function DashboardPage() {
  const [dashboards, setDashboards] = useState<DashboardInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [data, setData] = useState<DashboardData>();
  const [loadingDashboards, setLoadingDashboards] = useState(true);
  const [loadingData, setLoadingData] = useState(false);

  // Load available dashboards
  useEffect(() => {
    const fetchBusinesses = async () => {
      const res = await edenTreatyApi.business.mybusinesses.get();
      if (res.data) {
        setDashboards(res.data);
        setSelectedId(res.data[0]?.id);
        setLoadingDashboards(false);
      }
    };
    fetchBusinesses();
  }, []);

  // Load dashboard data
  useEffect(() => {
    if (!selectedId) return;
    setLoadingData(true);
    const fetchJobPosts = async () => {
      const res = await edenTreatyApi.business
        .jobposts({ id: selectedId })
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
      <DashboardNavbar
        dashboards={dashboards}
        selectedId={selectedId}
        onChange={setSelectedId}
        loading={loadingDashboards}
      />

      <main className="p-6">
        <DashboardCards data={data} loading={loadingData} />
      </main>
    </div>
  );
}
