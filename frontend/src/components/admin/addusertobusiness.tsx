"use client";

import { edenTreatyApi } from "@lib/eden";
import { useState } from "react";

interface ApiResponse {
  success: boolean;
  message: string;
}

export function AddUserCard() {
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset previous message
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    try {
      const res = await edenTreatyApi.admin.addtobusiness.post({
        email: email,
        business: business,
      });
      if(res.data !== null){
      const data: ApiResponse =  res.data;
      setMessage(data.message);
      setIsError(!data.success);
      setEmail("");
      setBusiness("");
      }else if(res.error.status === 404){
      const data =  res.error.value;
      setMessage(data);
      setIsError(false);
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl ">
      <div className="card-body">
        <h2 className="card-title">Add user to business </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Email input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">User Email</span>
            </label>
            <input
              type="email"
              placeholder="user@example.com"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Organization input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Business Name</span>
            </label>
            <input
              type="text"
              placeholder="Acme Corp"
              className="input input-bordered w-full"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Submit button */}
          <div className="card-actions justify-end mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? "btn-disabled" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Adding...
                </>
              ) : (
                "Add User"
              )}
            </button>
          </div>
        </form>

        {/* Message display */}
        {message && (
          <div className="mt-4">
            <div
              className={`alert ${isError ? "alert-error" : "alert-success"}`}
            >
              <span>{message}</span>
            </div>
          </div>
        )}

        {/* Common error/info messages mapping (optional enhancement) */}
        {message === "User Not Found" && (
          <div className="text-sm text-base-content/70 mt-2">
            Hint: Make sure the email is registered in the system.
          </div>
        )}
        {message === "Organization Not Found" && (
          <div className="text-sm text-base-content/70 mt-2">
            Hint: Check the exact organization name (case sensitive).
          </div>
        )}
      </div>
    </div>
  );
}
