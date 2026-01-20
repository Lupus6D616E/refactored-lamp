"use client";
import { edenApi } from "@lib/eden";
import { useEffect, useState } from "react";

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
      const response = await edenApi.ai.compare.post({postId: id});
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
    <div className="card w-full max-w-4xl bg-base-100 shadow-xl border border-primary/20">
      <div className="card-body gap-6">
        <div className="card-actions mt-4">
          <div className="space-y-6">
            <section className="prose prose-sm max-w-none">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <span className="badge badge-outline badge-sm"></span>
                WARNING! AI MAY MAKE MISTAKES!
              </h3>
              <p className="text-base-content/80 leading-relaxed text-justify whitespace-pre-wrap ">
                {statusText}
              </p>
            <p className="text-base-content/80 leading-relaxed text-justify whitespace-pre-wrap ">
                Powered By:{model}
              </p>
            </section>
          </div>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="btn btn-primary btn-block"
          >
            Compare with AI
          </button>
        </div>
      </div>
    </div>
  );
};
