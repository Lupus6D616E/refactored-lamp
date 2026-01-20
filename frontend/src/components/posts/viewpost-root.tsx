import { createRoot } from "react-dom/client";
import { PostCard } from "./viewpost";
import { edenApi } from "@lib/eden";
import { useEffect, useState } from "react";
import { AIComparison } from "./compare";

function App() {
  const [title, setTitle] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [minimumSalary, setSalary] = useState(0);
  const [postedDate, setPostedDate] = useState(new Date());
  const [expireDate, setExpireDate] = useState(new Date());
  const [tags, setTags] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);

  useEffect(() => {
    const getJobDetails = async () => {
      const res = await edenApi.view.job({ id: getPostId() }).get();
      if (res.data) {
        const jobDetails = res.data[0];
        if (typeof jobDetails.title === 'string' ) {
          setTitle(jobDetails.title);
        }
        if (typeof jobDetails.description === 'string') {
          setDescription(jobDetails.description);
        }
        if (typeof jobDetails.requirements === 'string') {
          setRequirements(jobDetails.requirements);
        }
        if(typeof jobDetails.responsibilities === 'string') {
          setResponsibilities(jobDetails.responsibilities);
        }
        if(typeof jobDetails.city === 'string') {
          setCity(jobDetails.city);
        }
        if(typeof jobDetails.employmentType === 'string') {
          setEmploymentType(jobDetails.employmentType);
        }
        if(typeof jobDetails.salaryMinimum === 'number') {
          setSalary(jobDetails.salaryMinimum);
        }
        if(typeof jobDetails.postedAt === 'string') {
          setPostedDate(jobDetails.postedAt);
        }
        if(typeof jobDetails.expiresAt === 'string') {
          setExpireDate(jobDetails.expiresAt);
        }
        if(typeof jobDetails.postedAt === 'string') {
          setPostedDate(jobDetails.postedAt);
        }
        if(typeof jobDetails.status === 'string') {
          setStatus(jobDetails.status);
        }
        if( jobDetails.schedule !== null) {
          setSchedule(jobDetails.schedule);
        }
        if( jobDetails.tags) {
          setTags(jobDetails.tags);
        }
        if(typeof jobDetails.contact === 'string') {
          setContact(jobDetails.contact);
        }
      }
    };
    getJobDetails();
  }, []);

  return (
    <main>
      <div className="min-h-screen bg-base-200 py-12">
        <PostCard
          title={title}
          description={description}
          requirements={requirements}
          responsibilities={responsibilities}
          city={city}
          status={status}
          employmentType={employmentType}
          contact={contact}
          minimumSalary={minimumSalary}
          expireDate={expireDate}
          postedDate={postedDate}
          schedule={schedule}
          tags={tags}
        />
        <AIComparison
          id={getPostId()}
        />
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
