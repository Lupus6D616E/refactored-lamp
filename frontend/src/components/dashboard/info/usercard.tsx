"use client";

import { authClient } from "backend/src/lib/auth-client";
import { edenApi } from "@lib/eden";
import { useEffect, useState } from "react";



export default function UserProfileCard() {
  const { data: session, isPending } = authClient.useSession();
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<string[]>([]);
  useEffect(() => {
    const getProfileDetails = async () => {
      const res = await edenApi.user.profile.get();
      if (res.data){
        const userprofile = res.data[0]
        if(userprofile.description !== null){
        setDescription(userprofile.description)
        }
        if(userprofile.address !== null){
          setAddress(userprofile.address)
        }
        if(userprofile.education !== null){
          setEducation(userprofile.education)
        }
        setSkills(userprofile.skills)
        setSchedule(userprofile.schedule)
      }
    };
    getProfileDetails()
  },[]);
  if (isPending) {
    return (
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center space-x-4">
            <div className="skeleton h-16 w-16 shrink-0 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-4 w-48" />
              <div className="skeleton h-4 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return <p> You are not logged in! </p>;
  }

  const { user } = session;

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Welcome back!</h2>
        <div className="flex items-center space-x-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-16">
              <span className="text-xl uppercase">
                {user.name?.[0] ?? user.email[0]}
              </span>
            </div>
          </div>
          <div>
            {user.name && <p className="text-lg font-semibold">{user.name}</p>}
            <p className="text-sm text-base-content/70">{user.email}</p>
            <p className="text-sm text-base-content/70">{user.role}</p>
            <p className="text-sm text-base-content/70">
              {description}
            </p>
            <p className="text-sm text-base-content/70">
              {education}
            </p>
            <p className="text-sm text-base-content/70">{skills}</p>
            <p className="text-sm text-base-content/70">{address}</p>
            
            <p className="text-sm text-base-content/70">
              {schedule}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
