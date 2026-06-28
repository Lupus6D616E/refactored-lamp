
import { InfoCard } from '@components/verify/admin/seeker/SeekerVerificationInfo';
import { SeekerPendingVerificationList } from '@components/verify/admin/seeker/adminVerifySeekerList';
import { useState } from 'react';


interface SeekerInfo {
    id: number;
    userName: string | null
    email: string| null
    status: string;
    disabilities: string[] | null
}
export function SeekerVerifyPage() {
    const [seekerInfo, setSeekerInfo] = useState<SeekerInfo>({
        id: 0,
        userName: "Empty",
        email: "empty",
        status: "empty",
        disabilities: null,
    })

    return (
        <div className="min-h-screen bg-base-200 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-10">Verify Seekers </h1>
                <SeekerPendingVerificationList seekerInfo={seekerInfo} setSeekerInfo={setSeekerInfo} />
                <div className="flex justify-center">
                    <InfoCard
                        id={seekerInfo.id}
                        userName={seekerInfo.userName}
                        email={seekerInfo.email}
                        status={seekerInfo.status}
                        disabilities={seekerInfo.disabilities}
                    />
                </div>
            </div>
        </div>
    );
}
