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
//Sample of Recommended Jobs Data//
const MOCK_JOBS: Job[] = [
  { id: 1, title: "Frontend Developer", company: "TechFlow Solutions", location: "Remote", type: "Full-time", salary: "₱60k - ₱80k", tags: ["React", "TypeScript"], logo: "TF", matchScore: 95 },
  { id: 2, title: "UI/UX Designer", company: "Creative Minds", location: "BGC, Taguig", type: "Contract", salary: "₱45k - ₱55k", tags: ["Figma", "Tailwind"], logo: "CM", matchScore: 88 },
  { id: 3, title: "Full Stack Engineer", company: "Global Connect", location: "Makati City", type: "Full-time", salary: "₱90k - ₱120k", tags: ["Node.js", "MongoDB"], logo: "GC", matchScore: 92 },
  { id: 4, title: "Junior Web Developer", company: "StartUp PH", location: "Remote", type: "Internship", salary: "₱20k - ₱25k", tags: ["HTML", "CSS"], logo: "SP", matchScore: 75 },
  { id: 5, title: "DevOps Engineer", company: "CloudScale", location: "Cebu City", type: "Full-time", salary: "₱100k+", tags: ["AWS", "Docker"], logo: "CS", matchScore: 82 },
  { id: 6, title: "Product Manager", company: "Innovation Hub", location: "Remote", type: "Full-time", salary: "₱80k - ₱110k", tags: ["Agile", "Scrum"], logo: "IH", matchScore: 90 }
];

const Icons = {
  Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  CheckCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  Refresh: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
};

interface JobCardProps {
  job: Job;
  isApplied: boolean;
  onApply: () => void;
}

const JobCard = ({ job, isApplied, onApply }: JobCardProps) => (

  <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-base-300">
    <div className="card-body p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-xl w-12">
            <span className="text-xl font-bold">{job.logo}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="badge badge-outline badge-primary font-medium">{job.type}</div>
          <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">{job.matchScore}% Match</div>
        </div>
      </div>
      <h2 className="card-title text-lg">{job.title}</h2>
      <p className="text-base-content/70 text-sm font-semibold">{job.company}</p>
      <div className="flex items-center gap-1 text-xs text-base-content/50 mt-1">
        <Icons.MapPin />
        {job.location}
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {job.tags.map(tag => (
          <span key={tag} className="badge badge-ghost badge-sm py-3">{tag}</span>
        ))}
      </div>
      <div className="card-actions justify-between items-center mt-6 pt-4 border-t border-base-200">
        <div className="text-lg font-bold text-success">{job.salary}</div>
        {/* Dynamic button styling based on isApplied state */}
        <button
          onClick={onApply}
          disabled={isApplied}
          className={`btn btn-sm rounded-lg px-4 transition-all duration-200 ${
            isApplied ? 'btn-success text-white' : 'btn-primary'
          }`}
        >
          {isApplied ? '✓ Applied' : 'Apply Now'}
        </button>
      </div>
    </div>
  </div>
);


export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("New jobs found!");
  
  // Dito natin ise-save ang mga IDs ng mga in-apply-an na trabaho
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);

  const fetchJobs = () => {
    setLoading(true);
    setTimeout(() => {
      const shuffled = [...MOCK_JOBS].sort(() => 0.5 - Math.random());
      setJobs(shuffled.slice(0, 3));
      setLoading(false);
      setToastMessage("New jobs found!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
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
    <div className="min-h-screen bg-base-200 font-sans" data-theme="light">
      <main className="p-4 md:p-10 max-w-7xl mx-auto">
        {/* Statistics Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="stats shadow bg-base-100 border border-base-300">
            <div className="stat">
              <div className="stat-figure text-primary"><Icons.CheckCircle /></div>
              <div className="stat-title font-medium">Applied Jobs</div>
              {/* Automatic nang bibilangin ang array size ng in-apply-an */}
              <div className="stat-value text-primary transition-all duration-300">
                {appliedJobIds.length}
              </div>
            </div>
          </div>
         
          <div className="stats shadow bg-base-100 border border-base-300">
            <div className="stat">
              <div className="stat-title font-medium">Daily Picks</div>
              <div className="stat-value text-accent">{loading ? "..." : jobs.length}</div>
            </div>
          </div>
        </div>

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