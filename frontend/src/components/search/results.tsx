import { authClient } from "@lib/auth-client";
import { SearchResult } from "./types";

interface Props {
  results: SearchResult[];
}

export default function ResultsList({ results }: Props) {

    const { data: session, isPending } = authClient.useSession();
  if (!results.length) {
    return (
      <div className="text-center text-gray-500">
        No results yet
      </div>
    );
  }

  const truncateDescription = (text:string, maxLength:number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength).trim() + '...';
};

  return (
    <div className="grid gap-4 max-w-4xl mx-auto w-full px-2">
  {results.map((item) => (
    <div 
      key={item.id} 
      className="card bg-base-100 shadow-sm hover:shadow-md border border-base-200 transition-all duration-200"
    >
      <div className="card-body p-5 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Left Side: Info Elements */}
        <div className="space-y-2 flex-1 w-full">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="card-title text-base-content font-bold hover:text-primary transition-colors cursor-pointer">
              {item.title}
            </h2>
            
            {/* Admin Badge para sa Job ID */}
            {session?.user.role === "admin" && (
              <span className="badge badge-neutral font-mono text-[10px] tracking-wider font-bold">
                ID: {item.id}
              </span>
            )}
          </div>
          
          {/* Truncated Description */}
          <p className="text-sm text-base-content/70 leading-relaxed text-justify whitespace-pre-wrap">
            {truncateDescription(item.description, 300)}
          </p>
          
          {/* Sub-details (City & Employment Type) */}
          <div className="flex flex-wrap gap-3 pt-1 text-xs font-semibold text-base-content/60">
            {/* Location Tag */}
            <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span>{item.city}</span>
            </div>

            {/* Employment Type Tag */}
            <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-secondary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875c-.621 0-1.125-.504-1.125-1.125v-4.25m16.5 0a2.25 2.25 0 0 0-1.875-2.217A15.004 15.004 0 0 0 12 12.25c-2.91 0-5.523.835-6.716 2.183a2.25 2.25 0 0 0-1.875 2.217m16.5 0a2.25 2.25 0 0 1-1.875 2.217 14.993 14.993 0 0 1-12.75 0 2.25 2.25 0 0 1-1.875-2.217M12 12.25v-1.5m0 0a2.25 2.25 0 0 0 4.5 0M12 10.75a2.25 2.25 0 0 1-4.5 0M15.75 9c0 1.243-1.007 2.25-2.25 2.25h-1.5C10.757 11.25 9.75 10.243 9.75 9V5.25c0-1.243 1.007-2.25 2.25-2.25h1.5c1.243 0 2.25 1.007 2.25 2.25V9Z" />
              </svg>
              <span>{item.employmentType}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Button */}
        <div className="w-full md:w-auto shrink-0 border-t border-base-200 md:border-none pt-3 md:pt-0 flex justify-end">
          <a 
            className="btn btn-primary btn-sm md:btn-md shadow-sm hover:scale-105 active:scale-95 transition-all w-full md:w-auto font-bold" 
            href={`viewpost.html?id=${item.id}`}
          >
            Go to post
          </a>
        </div>

      </div>
    </div>
  ))}
</div>
  );
}