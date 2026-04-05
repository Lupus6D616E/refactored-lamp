import { authClient } from "@lib/auth-client";
import { edenTreatyApi } from "@lib/eden";
import React, { useEffect, useState } from "react";
import { PendingPage } from "./pending";
import { RejectedPage } from "./rejected";
export const VerificationPage: React.FC = () => {

    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string>("");
    const [isVerified, setVerified] = useState("none");
    const [buttonText, setButtonText] = useState("Submit");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [industry, setIndustry] = useState("");

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await edenTreatyApi.verify.business.status.get();
                if (!res.data) {
                    console.log("no applications found")
                }
                else {
                    if (res.data.status === "accepted"
                    ) {
                        setVerified("verified")
                    }
                    else if (res.data.status === "") {
                        setVerified("pending")
                    }
                    else{
                        setVerified("rejected")
                    }
                }
            } catch (err) {

            } finally {

            }
        };

        fetchStatus();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");

        if (!e.target.files) return;

        const selectedFiles = Array.from(e.target.files);

        // Validate PDFs only
        const invalidFiles = selectedFiles.filter(
            (file) => file.type !== "application/pdf"
        );

        if (invalidFiles.length > 0) {
            setError("Only PDF files are allowed.");
            setFiles([]);
            return;
        }

        setFiles(selectedFiles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (files.length === 0) {
            setError("Please upload at least one PDF file.");
            return;
        }

        setError("");

        console.log("Submitting files:", files);
        const res = await edenTreatyApi.verify.business.upload.post({
            name: name,
            description: description,
            address: address,
            industry: industry,
            documents: files
        })
        if (res.data?.success) {
            setButtonText('success');
            setTimeout(() => {
                setButtonText('Submit');
            }, 2000); // 2 seconds
        }
    };
    if (isVerified === "none") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200 p-6">
                <form
                    onSubmit={handleSubmit}
                    className="card w-full max-w-xl bg-base-100 shadow-xl p-6 space-y-6"
                >


                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/80">
                                Business Name
                            </span>
                        </label>
                        <input
                            name="businessName"
                            type="text"
                            placeholder="Name"
                            value={name}
                            className="input input-bordered w-full"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/80">
                                Address
                            </span>
                        </label>
                        <input
                            name="address"
                            type="text"
                            value={address}
                            placeholder="123 Juan Street, Manila..."
                            className="input input-bordered w-full"
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/80">
                                Description
                            </span>
                        </label>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={description}
                            className="textarea input input-bordered w-full"
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text font-medium text-base-content/80">
                                Industry
                            </span>
                        </label>
                        <input
                            name="industry"
                            type="text"
                            placeholder="Industry (i.e Technology)"
                            value={industry}
                            className="input input-bordered w-full"
                            onChange={(e) => setIndustry(e.target.value)}
                            required
                        />
                    </div>

                    <h2 className="text-2xl font-bold text-center">
                        Upload PDF Files
                    </h2>

                    {/* File Input */}
                    <input
                        type="file"
                        multiple
                        accept="application/pdf"
                        className="file-input file-input-bordered w-full"
                        onChange={handleFileChange}
                    />

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="text-sm">
                            <p className="font-semibold mb-2">Selected files:</p>
                            <ul className="list-disc list-inside">
                                {files.map((file, idx) => (
                                    <li key={idx}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-lg w-full text-lg"
                    >
                        {buttonText}
                    </button>
                </form>
            </div>
        );
    }
    else if (isVerified === "pending") {
        return (<PendingPage />)
    }

        else if (isVerified === "rejected") {
            return (<RejectedPage />)
    }
};
