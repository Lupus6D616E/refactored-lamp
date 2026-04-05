// components/InfoCard.tsx
import React from 'react';

interface InfoCardProps {
    id: number;
    userName: string | null
    businessName: string;
    description: string;
    address: string;
    email: string| null
    industry: string;
    status: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
    id,
    userName,
    businessName,
    description,
    address,
    email,
    industry,
    status,

}) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">

      
      <div className="card-body">

        <h2 className="card-title text-2xl font-bold">id:{id}</h2>
        <h2 className="card-title text-2xl font-bold">user name:{userName}</h2>
        
        <h2 className="card-title text-2xl font-bold">business name:{businessName}</h2>

        <h2 className="card-title text-2xl font-bold">industry:{industry}</h2>

        <h2 className="card-title text-2xl font-bold">email:{email}</h2>

        <h2 className="card-title text-2xl font-bold">status:{status}</h2>
        <p className="text-base-content/80 mt-2 line-clamp-3">
          {description}
        </p>

        <div className="mt-4 flex items-start gap-2">
          <div className="text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314-11.314z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium">Address</p>
            <p className="text-sm text-base-content/70 leading-tight">{address}</p>
          </div>
        </div>

        <div className="card-actions justify-end mt-6">
          <button className="btn btn-primary">action!</button>
        </div>
      </div>
    </div>
  );
};

