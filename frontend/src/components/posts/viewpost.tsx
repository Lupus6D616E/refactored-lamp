"use client";
import { StaticMap } from "@components/map/mapstatic/map";
import { authClient } from "@lib/auth-client";
import { edenTreatyApi } from "@lib/eden";
import { LatLngLiteral } from "leaflet";
import { useState } from "react";
import haversineDistance from "haversine-distance";
import AccessibilityWidget from "@components/auxilliary/accessability";

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
  address: string;
  location: LatLngLiteral;
  myLocation: LatLngLiteral;
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
  tags, address, location, myLocation
}) => {
  const [buttonText, setButtonText] = useState<string>("Apply");
  const [isLoading, setIsLoading] = useState(false);
  const distanceKm = (haversineDistance(location, myLocation)) / 1000;
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
    
    <div className="card w-full max-w-4xl bg-base-100 shadow-xl border border-primary/20 mx-auto">
      <ul className="menu menu-horizontal px-1 items-center gap-2">
            <li>
              <button 
                 onClick={() => window.history.back()} 
                 className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 transition-all duration-200 group"
                >
               <svg 
                 xmlns="http://www.w3.org/2000/svg" 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 strokeWidth={2.5} 
                 stroke="currentColor" 
                 className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
               >
               <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
               </svg>
               <span className="font-medium">Back</span>
              </button>
            </li>
          </ul>
      <div className="card-body gap-6">
        {/* Cool Title Placeholder */}
        <h2 className="card-title text-3xl font-black italic tracking-tighter text-secondary uppercase italic">
          {title}
          <div className="badge badge-secondary ml-2 animate-pulse text-xs">
            {status}
          </div>
        </h2>

        {/* 5 Small Info Pieces (Quick Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-base-100 rounded-xl shadow-sm border border-base-200">
  
  {/* Location */}
  <div className="bg-base-200 p-3 rounded-xl flex flex-col justify-between">
    <span className="text-[10px] uppercase font-bold tracking-wider text-primary opacity-80">Location</span>
    <span className="text-sm font-semibold text-base-content truncate mt-1">{city}</span>
  </div>

  {/* Type */}
  <div className="bg-base-200 p-3 rounded-xl flex flex-col justify-between">
    <span className="text-[10px] uppercase font-bold tracking-wider text-primary opacity-80">Type</span>
    <span className="text-sm font-semibold text-base-content truncate mt-1">{employmentType}</span>
  </div>

  {/* Contact */}
  <div className="bg-base-200 p-3 rounded-xl flex flex-col justify-between">
    <span className="text-[10px] uppercase font-bold tracking-wider text-primary opacity-80">Contact</span>
    <span className="text-sm font-semibold text-base-content truncate mt-1">{contact}</span>
  </div>

  {/* Minimum Salary */}
  <div className="bg-base-200 p-3 rounded-xl flex flex-col justify-between">
    <span className="text-[10px] uppercase font-bold tracking-wider text-primary opacity-80">Minimum Salary</span>
    <span className="text-sm font-bold text-success truncate mt-1">Php {minimumSalary}</span>
  </div>

  {/* Posted At */}
  <div className="bg-base-200 p-3 rounded-xl flex flex-col justify-between">
    <span className="text-[10px] uppercase font-bold tracking-wider text-primary opacity-80">Posted At</span>
    <span className="text-sm font-semibold text-base-content truncate mt-1">{postedDate.toDateString()}</span>
  </div>

  {/* Expires At */}
  <div className="bg-base-200 p-3 rounded-xl flex flex-col justify-between">
    <span className="text-[10px] uppercase font-bold tracking-wider text-primary opacity-80">Expires At</span>
    <span className="text-sm font-semibold text-error truncate mt-1">{expireDate.toDateString()}</span>
  </div>

  {/* Distance (Conditional) */}
  {session?.user.role === "user" && (
    <div className="bg-base-200 p-3 rounded-xl flex flex-col justify-between">
      <span className="text-[10px] uppercase font-bold tracking-wider text-primary opacity-80">Distance</span>
      <span className="text-sm font-semibold text-base-content mt-1">
        {distanceKm.toFixed(2)} km
      </span>
    </div>
  )}

  {/* Posted By & Address (Mas malapad para sa mahahabang text) */}
  <div className="bg-base-200 p-3 rounded-xl col-span-2 flex flex-col justify-between">
    <div>
      <span className="text-[10px] uppercase font-bold tracking-wider text-primary opacity-80">Posted By & Address</span>
      <span className="text-sm font-bold text-base-content block mt-1 truncate">{businessName}</span>
      <span className="text-xs text-base-content/70 block mt-0.5 line-clamp-2">{address}</span>
    </div>
  </div>

  {/* Action Button */}
<div className="col-span-2 md:col-span-3 lg:col-span-4 flex justify-end mt-4">
  <a
    className="btn btn-secondary btn-sm md:btn-md gap-2 font-bold tracking-wide shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 group"
    href={`businessprofile.html?id=${businessId}`}
  >
    <span>View Business</span>
    {/* Arrow Icon na gumagalaw pakanan kapag hinover ang button */}
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={2.5} 
      stroke="currentColor" 
      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  </a>
</div>

</div>

        <div className="divider my-0"></div>

        {/* 3 Long Text Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
  
  {/* Details Section */}
  <section className="bg-base-200/50 p-5 rounded-2xl border border-base-200 shadow-sm flex flex-col justify-between">
    <div className="prose prose-sm max-w-none">
      <h3 className="text-md font-bold uppercase tracking-wide flex items-center gap-2 text-primary mb-3">
        <span className="badge badge-primary badge-xs"></span>
        Job Details
      </h3>
      <p className="text-base-content/80 leading-relaxed text-sm whitespace-pre-wrap">
        {description}
      </p>
    </div>
  </section>

  {/* Requirements Section */}
  <section className="bg-base-200/50 p-5 rounded-2xl border border-base-200 shadow-sm flex flex-col justify-between">
    <div className="prose prose-sm max-w-none">
      <h3 className="text-md font-bold uppercase tracking-wide flex items-center gap-2 text-secondary mb-3">
        <span className="badge badge-secondary badge-xs"></span>
        Requirements
      </h3>
      <p className="text-base-content/80 leading-relaxed text-sm whitespace-pre-wrap">
        {requirements}
      </p>
    </div>
  </section>

  {/* Responsibilities Section */}
  <section className="bg-base-200/50 p-5 rounded-2xl border border-base-200 shadow-sm flex flex-col justify-between">
    <div className="prose prose-sm max-w-none">
      <h3 className="text-md font-bold uppercase tracking-wide flex items-center gap-2 text-accent mb-3">
        <span className="badge badge-accent badge-xs"></span>
        Responsibilities
      </h3>
      <p className="text-base-content/80 leading-relaxed text-sm whitespace-pre-wrap">
        {responsibilities}
      </p>
    </div>
  </section>

</div>

        <div className="space-y-6 mt-6">
  
  {/* Map Section */}
  <section className="bg-base-200/50 p-4 rounded-2xl border border-base-200 shadow-sm">
    <h3 className="text-md font-bold uppercase tracking-wide flex items-center gap-2 text-primary mb-3">
      <span className="badge badge-primary badge-xs"></span>
      Job Location Map
    </h3>
    {/* Nilagyan ng overflow-hidden at rounded para bumagay sa card ang map */}
    <div className="rounded-xl overflow-hidden border border-base-300 shadow-inner">
      <StaticMap center={[location.lat, location.lng]} popupContent={address} />
    </div>
  </section>

  {/* Badges Container (Tags & Schedule) */}
  <div className="p-4 bg-base-100 rounded-2xl border border-base-200 shadow-sm space-y-4">
    
    {/* Schedule Tags */}
    {schedule && schedule.length > 0 && (
      <div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-base-content/60 block mb-2">
          Work Schedule
        </span>
        <div className="flex flex-wrap gap-2">
          {schedule.map((tag, idx) => (
            <div
              key={idx}
              className="badge badge-secondary badge-md gap-1 font-medium shadow-sm py-3"
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Job Tags */}
    {tags && tags.length > 0 && (
      <div>
        <span className="text-[10px] uppercase font-bold tracking-wider text-base-content/60 block mb-2">
          Skills & Tags
        </span>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className="badge badge-sm bg-base-200 text-base-content hover:bg-primary hover:text-primary-content border-none cursor-pointer transition-all duration-200 py-2.5 px-3"
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>
    )}

  </div>

  {/* Main Action Button */}
  {session?.user.role === "user" && (
    <div className="pt-2">
      <button 
        onClick={handleClick} 
        className="btn btn-primary btn-block shadow-md text-base font-bold tracking-wide hover:scale-[1.01] active:scale-[0.99] transition-all"
      >
        {buttonText}
      </button>
    </div>
  )}

</div>
</div>
<AccessibilityWidget />
    </div>
  );
};
