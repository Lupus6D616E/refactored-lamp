// components/InfoCard.tsx
import { edenTreatyApi } from '@lib/eden';
import React from 'react';

interface InfoCardProps {

    id: number;
    userName: string | null
    email: string| null
    status: string;
    disabilities: string[] | null
}

export const InfoCard: React.FC<InfoCardProps> = ({
    id,
    userName,
    email,
    status,
    disabilities,

}) => {
    async function downloadPDFs(id: number) {
        const { data, error, response } = await edenTreatyApi.verify.admin.verification.seeker.file.get({query: { id: id, seekerType: status}})
 if (error) {
    console.error('Server error:', error);
    return;
  }

  if (!response?.ok) {
    console.error('Download failed with status:', response?.status);
    return;
  }

  try {
    // Get the raw binary data as Blob
    const blob = data instanceof Blob ? data : new Blob([data], { type: 'application/zip' })
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'documents.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to process ZIP blob:', err);
  }
}
    async function makedecision(id: number, decision: string ){
        const res = await edenTreatyApi.verify.admin.verification.seekerverify.post({id:id, decision: decision, seekerType:status})
    }
    return (
        <div className="card w-96 bg-base-100 shadow-xl">


            <div className="card-body">

                <h2 className="card-title text-2xl font-bold">id:{id}</h2>
                <h2 className="card-title text-2xl font-bold">user name:{userName}</h2>

                <h2 className="card-title text-2xl font-bold">email:{email}</h2>

                <h2 className="card-title text-2xl font-bold">status:{status}</h2>

                {status === "disabled" &&   <h2> Disabilities: {disabilities}</h2>}

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
                </div>

                <div className="card-actions justify-end mt-6">
                    <button className="btn btn-primary" onClick={() => downloadPDFs(id)}>download file</button>
                </div>

                <div className="card-actions justify-end mt-6">
                    <button className="btn btn-primary" onClick={() => makedecision(id,"accept")}>accept!</button>
                </div>

                <div className="card-actions justify-end mt-6">
                    <button className="btn btn-primary" onClick={() => makedecision(id,"reject")}>reject!</button>
                </div>
            </div>
        </div>
    );
};

