import { edenTreatyApi } from '@backend/src/lib/eden';
import React, { useState, useEffect } from 'react';


interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  tags: string[];
  logo: string;
  matchScore: number;
}
interface JobReal {

  id: number;
  title: string;
  city: string;
  description: string;
  salaryMinimum: number;
  employmentType: string;
  tags: string[];
  schedule: string[];
  businessName: string;
  businessId: string;
  similarity: number;

}
const Icons = {
  Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
  Refresh: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
};

interface JobCardProps {
  job: JobReal;
  isApplied: boolean;
  onApply: () => void;
}

const JobCard = ({ job, isApplied, onApply }: JobCardProps) => (

  <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-base-300">
    <div className="card-body p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-xl w-12">
            <span className="text-xl font-bold">{job.businessName.charAt(0)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="badge badge-outline badge-primary font-medium">{job.employmentType}</div>
          <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">{(Math.round(((1 + job.similarity)/2)*100 ))}% Match</div>
        </div>
      </div>
      <h2 className="card-title text-lg">{job.title}</h2>
      <p className="text-base-content/70 text-sm font-semibold">{job.businessName}</p>
      <div className="flex items-center gap-1 text-xs text-base-content/50 mt-1">
        <Icons.MapPin />
        {job.city}
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {job.tags.map(tag => (
          <span key={tag} className="badge badge-ghost badge-sm py-3">{tag}</span>
        ))}
      </div>
      <div className="card-actions justify-between items-center mt-6 pt-4 border-t border-base-200">
        <div className="text-lg font-bold text-success">{job.salaryMinimum} Php</div>
        {/* Dynamic button styling based on isApplied state */}
        
            <a  className="btn btn-primary btn-sm w-full mt-2" href={`viewpost.html?id=${job.id}`} > Go to post </a>
      </div>
    </div>
  </div>
);


export default function App() {
  const [jobs, setJobs] = useState<JobReal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("New jobs found!");

  // Dito natin ise-save ang mga IDs ng mga in-apply-an na trabaho
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await edenTreatyApi.user.getrecommendedjobs.get({
      });
      if (response.error) {
        console.error("Search error:", response.error);
        setLoading(false)
        setToastMessage("A server error has occurred!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        // Handle error (e.g. toast notification)
        return;
      }
      console.log("Search results:", response.data);
      if (response.data) {
        const shuffled = [...response.data].sort(() => 0.5 - Math.random());
        setJobs(shuffled.slice(0, 3));
        setLoading(false)
        setToastMessage("New jobs found!");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      // Update UI with response.data.results, etc.
    } catch (err) {
      console.error("Network/search failed:", err);
    }
    /*
    setTimeout(() => {
      const shuffled = [...MOCK_JOBS].sort(() => 0.5 - Math.random());
      setJobs(shuffled.slice(0, 3));
      setLoading(false);
      setToastMessage("New jobs found!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
    */
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Function para i-handle ang pagpindot ng Apply Now button
  const handleApply = (jobId: number, jobTitle: string) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds(prev => [...prev, jobId]);
      setToastMessage(`Successfully applied to ${jobTitle}!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 font-sans">
      <main className="p-4 md:p-10 max-w-7xl mx-auto">
        
        {/* Recommended Jobs Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recommended <span className="text-primary underline decoration-4 underline-offset-4">for You</span></h2>
            <button
              onClick={fetchJobs}
              disabled={loading}
              className={`btn btn-outline btn-primary btn-sm gap-2 rounded-full px-6 ${loading ? 'loading' : ''}`}
            >
              {!loading && <Icons.Refresh />}
              {loading ? 'Analyzing...' : 'Refresh'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="skeleton h-64 w-full rounded-2xl"></div>
              ))
            ) : (
              jobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  isApplied={appliedJobIds.includes(job.id)}
                  onApply={() => handleApply(job.id, job.title)}
                />
              ))
            )}
          </div>
        </section>

        {/* Notifications and Toasts */}
        {showToast && (
          <div className="toast toast-end toast-bottom">
            <div className="alert alert-success shadow-lg text-white">
              <span>{toastMessage}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}