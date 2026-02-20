// DashboardPage.tsx
import { useEffect, useState } from "react";
import { DashboardNavbar } from "./dashboardnavbar";
import { JobPostCards } from "./JobPostCards";
import { JobPostData, BusinessSelect, MessageData } from "./types";
import { edenTreatyApi } from "@lib/eden";
import { MessageCards } from "./messageCards";

export function DashboardPage() {
  const [dashboards, setDashboards] = useState<BusinessSelect[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [jobPostData, setJobPostData] = useState<JobPostData>();
  const [messageData, setMessageData] = useState<MessageData>();
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
        setJobPostData(data);
      }
      setLoadingData(false);
    };
    const fetchMessages = async () => {
      const res = await edenTreatyApi.message.businessmymessages({id:selectedId}).get()
       if (res.data) {
        const data = {
          info: res.data,
        };
        setMessageData(data);
      }
      setLoadingData(false);
    }
    fetchJobPosts();
    fetchMessages()
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
        <div className="card w-min-screen bg-base-300 card-sm shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Job Posts</h2>
            <JobPostCards data={jobPostData} loading={loadingData} />
          </div>
        </div>
      </main>
      <main className="p-6">
        <div className="card w-min-screen bg-base-300 card-sm shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Messages </h2>
            <MessageCards data={messageData} businessId={selectedId} loading={loadingData} />
          </div>
        </div>
      </main>
    </div>
  );
}
