
import { InfoCard } from './info';
import { PendingVerificationList } from './adminVerifyList';
import { useState } from 'react';


interface businessInfo {
    id: number;
    userName: string | null
    businessName: string;
    description: string;
    address: string;
    email: string| null
    status: string;
    industry: string;
    bin: string
}
export function VerifyPage() {
    const [businessInfo, setBusinessInfo] = useState<businessInfo>({
        id: 0,
        userName: "Empty",
        businessName: "empty",
        description: "empty",
        address: "empty",
        email: "empty",
        industry: "empty",
        status: "pending",
        bin: "0"
    })

    return (
        <div className="min-h-screen bg-base-200 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-4xl font-bold text-center mb-10">Information Card Demo</h1>
                <PendingVerificationList businessInfo={businessInfo} setBusinessInfo={setBusinessInfo} />
                <div className="flex justify-center">
                    <InfoCard
                        id={businessInfo.id}
                        businessName={businessInfo.businessName}
                        industry={businessInfo.industry}
                        status={businessInfo.status}
                        userName={businessInfo.userName}
                        description={businessInfo.description}
                        address={businessInfo.address}
                        email={businessInfo.email}
                        bin={businessInfo.bin}
                    />
                </div>
            </div>
        </div>
    );
}
