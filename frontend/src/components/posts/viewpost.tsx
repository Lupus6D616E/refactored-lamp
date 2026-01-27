"use client";
import { authClient } from "@lib/auth-client";
import { edenTreatyApi } from "@lib/eden";
import { useState } from "react";

interface CardProps {
  id: number;
  businessId: string;
  businessName: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  city: string;
  status: string;
  employmentType: string;
  contact: string;
  minimumSalary: number;
  postedDate: Date;
  expireDate: Date;
  schedule: string[];
  tags: string[];
}

export const PostCard: React.FC<CardProps> = ({
  id,
  title,
  businessId,
  businessName,
  description,
  requirements,
  responsibilities,
  city,
  status,
  employmentType,
  contact,
  minimumSalary,
  expireDate,
  postedDate,
  schedule,
  tags,
}) => {
  const [buttonText, setButtonText] = useState<string>("Apply");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const handleClick = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setButtonText("Loading...");
    try {
      const response = await edenTreatyApi.post.job({ id: id }).apply.post();
      if (!response.data) {
        throw new Error(`error! status: ${response.error.value}`);
      }
      const data = await response.data;
      if (data === "Application successful") {
        setButtonText("Application Success");
      } else {
        throw new Error(`something happened`);
      }
    } catch (err) {
      console.error(err);
      // Show error to user
      setButtonText(
        err instanceof Error ? err.message : "Something went wrong 😕",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-4xl bg-base-100 shadow-xl border border-primary/20">
      <div className="card-body gap-6">
        {/* Cool Title Placeholder */}
        <h2 className="card-title text-3xl font-black italic tracking-tighter text-secondary uppercase italic">
          {title}
          <div className="badge badge-secondary ml-2 animate-pulse text-xs">
            {status}
          </div>
        </h2>

        {/* 5 Small Info Pieces (Quick Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <div className="bg-base-200 p-2 rounded-lg text-center">
            <span className="text-[10px] uppercase font-bold text-primary block">
              Location
            </span>
            <span className="text-sm font-semibold truncate block">{city}</span>
            <span className="text-[10px] uppercase font-bold text-primary block">
              Type
            </span>
            <span className="text-sm font-semibold truncate block">
              {employmentType}
            </span>
            <span className="text-[10px] uppercase font-bold text-primary block">
              contact
            </span>
            <span className="text-sm font-semibold truncate block">
              {contact}
            </span>
            <span className="text-[10px] uppercase font-bold text-primary block">
              expires at
            </span>
            <span className="text-sm font-semibold truncate block">
              {expireDate.toDateString()}
            </span>
            <span className="text-[10px] uppercase font-bold text-primary block">
              posted at
            </span>
            <span className="text-sm font-semibold truncate block">
              {postedDate.toDateString()}
            </span>
            <span className="text-[10px] uppercase font-bold text-primary block">
              minimum Salary
            </span>
            <span className="text-sm font-semibold truncate block">
              Php {minimumSalary}
            </span>
            <span className="text-[10px] uppercase font-bold text-primary block">
              Posted by
            </span>
            <span className="text-sm font-semibold truncate block">
              {businessName}
            </span>

            <a
              className="btn btn-secondary"
              href={`businessprofile.html?id=${businessId}`}
            >
              {" "}
              View Business{" "}
            </a>
          </div>
        </div>

        <div className="divider my-0"></div>

        {/* 3 Long Text Sections */}
        <div className="space-y-6">
          <section className="prose prose-sm max-w-none">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="badge badge-outline badge-sm"></span>
              Details
            </h3>
            <p className="text-base-content/80 leading-relaxed text-justify whitespace-pre-wrap">
              {description}
            </p>
          </section>
        </div>
        <div className="space-y-6">
          <section className="prose prose-sm max-w-none">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="badge badge-outline badge-sm"></span>
              Requirements
            </h3>
            <p className="text-base-content/80 leading-relaxed text-justify whitespace-pre-wrap ">
              {requirements}
            </p>
          </section>
        </div>

        <div className="space-y-6">
          <section className="prose prose-sm max-w-none">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="badge badge-outline badge-sm"></span>
              Responsibilities
            </h3>
            <p className="text-base-content/80 leading-relaxed text-justify whitespace-pre-wrap">
              {responsibilities}
            </p>
          </section>
        </div>

        {/* Tag-like Array of Strings */}
        <div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className="badge badge-primary badge-outline hover:badge-primary cursor-pointer transition-colors"
            >
              #{tag}
            </div>
          ))}
        </div>
        <div className="card-actions justify-end mt-4 pt-4 border-t border-base-300">
          {schedule.map((tag, idx) => (
            <div
              key={idx}
              className="badge badge-primary badge-outline hover:badge-primary cursor-pointer transition-colors"
            >
              {tag}
            </div>
          ))}
        </div>
        {session?.user.role === "user" && (
          <div className="card-actions mt-4">
            <button onClick={handleClick} className="btn btn-primary btn-block">
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
