"use client";
import { edenTreatyApi } from "@lib/eden";
import {  useState } from "react";

interface CardProps {
  id: number;
}

export const AIComparison: React.FC<CardProps> = ({ id }) => {
  const [statusText, setStatusText] = useState<string>(
    "Generate AI comparison?",
  );
  const [model, setModel] = useState<string>(
    ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setStatusText("Loading...");
    try {
      const response = await edenTreatyApi.ai.compare.post({postId: id});
      if (!response.data) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.data;
      if(typeof data.output === 'string'){
      setStatusText(data.output || "Success! 🎉");
      setModel(data.model)
    }else{
        throw new Error(`something happened`);
    }

    } catch (err) {
      console.error(err);
      // Show error to user
      setStatusText(
        err instanceof Error ? err.message : "Something went wrong 😕",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="card w-full max-w-4xl bg-base-100 shadow-xl border-warning/30 mx-auto overflow-hidden">
  <div className="card-body p-6 md:p-8 gap-6">
    
    {/* Alert Header Section */}
    <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
      {/* Warning Icon */}
      <div className="p-2 bg-warning/20 text-warning-content rounded-xl shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-warning-content flex items-center gap-2">
          Warning! AI May Make Mistakes
        </h3>
        <p className="text-xs text-base-content/70 mt-0.5">
          Palaging suriin ang mga kritikal na impormasyon.
        </p>
      </div>
    </div>

    {/* Content Section */}
    <div className="space-y-4">
      <div className="prose prose-sm max-w-none bg-base-200/40 p-5 rounded-2xl border border-base-200 shadow-inner">
        <p className="text-base-content/80 leading-relaxed text-sm whitespace-pre-wrap">
          {statusText}
        </p>
      </div>

      {/* Model Tech Badge */}
      <div className="flex items-center gap-2 px-1 text-xs text-base-content/60 font-medium">
        <span className="inline-block w-2 h-2 rounded-full bg-success animate-pulse"></span>
        <span>Powered By:</span>
        <span className="badge badge-sm badge-neutral font-mono font-bold tracking-wide">{model}</span>
      </div>
    </div>

    {/* Action Button */}
    <div className="card-actions mt-2">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`btn btn-primary btn-block shadow-md font-bold tracking-wide transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${
          isLoading ? "loading" : ""
        }`}
      >
        {isLoading ? "Comparing..." : "Compare with AI"}
      </button>
    </div>

  </div>
</div>
  );
};
