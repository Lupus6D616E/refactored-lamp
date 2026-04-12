interface SearchSeekerResult {
  id: string;
  name: string;
  email: string;
  description: string | null;
  banned: boolean | null;
  distance: number;
  sim: number;
}

interface SearchBusinessResult {
  id: string;
  name: string;
  email: string;
  businessName: string[];
  description: string[];
  distance: number;
  sim: number;
}

import { edenTreatyApi } from "@lib/eden";
import { useState } from "react";

export function SearchUserCard() {
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState("Seeker");
  const [seekerResults, setSeekerResults] = useState<SearchSeekerResult[]>([]);
  const [businessResults, setBusinessResults] = useState<
    SearchBusinessResult[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userTypes = ["Seeker", "Business"];

  const handleSearch = async () => {
    if (!fullName.trim()) return;

    setLoading(true);
    setError(null);
    setSeekerResults([]);
    setBusinessResults([]);
    if (userType === "Seeker") {
      try {
        const res = await edenTreatyApi.search.seeker.get({
          query: {
            name: fullName,
          },
        });

        if (!res.data) {
          throw new Error("Search failed");
        }
        const data: SearchSeekerResult[] = res.data.result;
        setSeekerResults(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    if (userType === "Business") {
      try {
        const res = await edenTreatyApi.search.businessuser.get({
          query: {
            name: fullName,
          },
        });

        if (!res.data) {
          throw new Error("Search failed");
        }
        if (res.data.result === undefined){
          throw new Error("wtf")
        }
        const data: SearchBusinessResult[] = res.data.result;
        setBusinessResults(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body gap-4">
        <h2 className="card-title">Search User</h2>

        <input
          type="text"
          placeholder="Full name"
          className="input input-bordered w-full"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <label className="label">
          <span className="label-text">User Type</span>
        </label>
        <select
          className="select select-bordered w-full"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        >
          {userTypes.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {!loading && seekerResults.length === 0 && fullName && !error && (
          <p className="text-sm opacity-60">No results found.</p>
        )}

        {seekerResults.length > 0 && (
          <div className="divide-y rounded-lg border">
            {seekerResults.map((user, idx) => (
              <div key={idx} className="p-3">
                {!user.banned && <div className="badge badge-primary">Unbanned</div>}
                {user.banned && <div className="badge badge-error">Banned</div>}
                <p className="font-medium">USER ID:{user.id}</p>
                <p className="font-medium">USER NAME:{user.name}</p>
                <p className="text-sm opacity-70">USER EMAIL{user.email}</p>
                <p className="text-sm opacity-70">{user.description}</p>
                <a className="btn btn-secondary" href={`userprofile.html?id=${user.id}`}> visit profile </a>
              </div>
            ))}
          </div>
        )}
        {businessResults.length > 0 && (
          <div className="divide-y rounded-lg border">
            {businessResults.map((user, idx) => (
              <div key={idx} className="p-3">
                <p className="font-medium">USER ID:{user.id}</p>
                <p className="font-medium">USER NAME:{user.name}</p>
                <p className="text-sm opacity-70">USER EMAIL{user.email}</p>
                {user.businessName.map((business, index) => (
                <div key={index}>
                  <p className="font-medium"> business name: {index}:{user.businessName[index]} </p>
                  <p className="font-medium"> business description: {index}:{user.description[index]} </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
