import { createRoot } from "react-dom/client";
import { PostCard } from "./viewpost";
import { edenTreatyApi } from "@lib/eden";
import { useEffect, useState } from "react";
import { AIComparison } from "./compare";
import { authClient } from "@lib/auth-client";
import { LatLngLiteral } from "leaflet";
import { themeChange } from 'theme-change'
import NavBar from '@components/auxilliary/navbar'

function App() {
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [minimumSalary, setSalary] = useState(0);
  const [postedDate, setPostedDate] = useState(new Date());
  const [expireDate, setExpireDate] = useState(new Date());
  const [tags, setTags] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const { data: session, isPending } = authClient.useSession();
  const [position, setPosition] = useState<LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
  const [myPosition, setMyPosition] = useState<LatLngLiteral>({
    lat: 0,
    lng: 0,
  });

 useEffect(() => {
  const getJobDetails = async () => {
    const res = await edenTreatyApi.post.job({ id: getPostId() }).get();
    const mine = await edenTreatyApi.user.myprofile.get();

    // Safe profile location check
    if (mine.data) {
      if (mine.data.location?.y != null && mine.data.location?.x != null) {
        setMyPosition({
          lat: mine.data.location.y,
          lng: mine.data.location.x
        });
      } else {
        setMyPosition({ lat: 0, lng: 0 });
      }
    }

    // --- DITO ANG PAGBABAGO ---
    // 1. I-check kung ang res.data ay hindi null/undefined
    // 2. I-check kung may kahit isang item sa loob ng array (length > 0)
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      const jobDetails = res.data[0];

      // Ngayon, safe na itong basahin dahil alam nating may object sa index 0
      if (typeof jobDetails.title === "string") {
        setTitle(jobDetails.title);
      }
      if (typeof jobDetails.description === "string") {
        setDescription(jobDetails.description);
      }
      if (typeof jobDetails.requirements === "string") {
        setRequirements(jobDetails.requirements);
      }
      if (typeof jobDetails.responsibilities === "string") {
        setResponsibilities(jobDetails.responsibilities);
      }
      if (typeof jobDetails.city === "string") {
        setCity(jobDetails.city);
      }
      if (typeof jobDetails.employmentType === "string") {
        setEmploymentType(jobDetails.employmentType);
      }
      if (typeof jobDetails.salaryMinimum === "number") {
        setSalary(jobDetails.salaryMinimum);
      }

      // Safe date handling
      if (jobDetails.postedAt) {
        setPostedDate(new Date(jobDetails.postedAt));
      }
      if (jobDetails.expiresAt) {
        setExpireDate(new Date(jobDetails.expiresAt));
      }

      if (typeof jobDetails.status === "string") {
        setStatus(jobDetails.status);
      }
      if (jobDetails.schedule) {
        setSchedule(jobDetails.schedule);
      }
      if (jobDetails.tags) {
        setTags(jobDetails.tags);
      }
      if (typeof jobDetails.contact === "string") {
        setContact(jobDetails.contact);
      }
      if (typeof jobDetails.address === "string") {
        setAddress(jobDetails.address);
      }

      if (jobDetails.location) {
        setPosition({
          lat: jobDetails.location.y,
          lng: jobDetails.location.x
        });
      }

      if (typeof jobDetails.businessid === "string") {
        setBusinessId(jobDetails.businessid);
        const bizRes = await edenTreatyApi.business
          .profile({ id: jobDetails.businessid })
          .get();

        if (bizRes.error) {
          console.log(bizRes.error);
        }
        if (bizRes.data) {
          setBusinessName(bizRes.data.name);
        }
      }
    } else {
      // Opsyonal: Ano ang mangyayari kung walang nahanap na job?
      console.warn("No job found for ID:", getPostId());
    }
  };

  getJobDetails();
}, []);

  return (
    <main>
      <NavBar /> 
      <div className="min-h-screen bg-base-200">
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
        <PostCard
          id={getPostId()}
          title={title}
          description={description}
          requirements={requirements}
          responsibilities={responsibilities}
          city={city}
          businessId={businessId}
          businessName={businessName}
          status={status}
          employmentType={employmentType}
          contact={contact}
          minimumSalary={minimumSalary}
          expireDate={expireDate}
          postedDate={postedDate}
          schedule={schedule}
          tags={tags}
          address={address}
          location={position}
          myLocation={myPosition}
        />
        {session?.user.role === "user" && <AIComparison id={getPostId()} />}
      </div>
      
    </main>
  );
}

function getPostId() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("id") === null) {
    return 0;
  } else {
    return parseInt(params.get("id")!);
  }
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);