interface SearchSeekerResult {
  id: string;
  name: string;
  address: string;
  description: string;
  industry: string;
  distance: number;
  sim: number;
}

import { edenTreatyApi } from "@lib/eden";
import { useState } from "react";

export function SearchBusinessCard() {
  const [name, setName] = useState("");
  const [seekerResults, setSeekerResults] = useState<SearchSeekerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    setSeekerResults([]);
      try {
        const res = await edenTreatyApi.search.business.get({
          query: {
            name: name,
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
  };

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body gap-4">
        <h2 className="card-title">Search Businesses</h2>
        <input
          type="text"
          placeholder="Business name"
          className="input input-bordered w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        {!loading && seekerResults.length === 0 && name && !error && (
          <p className="text-sm opacity-60">No results found.</p>
        )}

        {seekerResults.length > 0 && (
          <div className="divide-y rounded-lg border">
            {seekerResults.map((business, idx) => (
              <div key={idx} className="p-3">
                <p className="font-medium">{business.name}</p>
                <p className="text-sm opacity-70">{business.address}</p>
                <p className="text-sm opacity-70">{business.description}</p>
                <p className="text-sm opacity-70">{business.industry}</p>
                <a className="btn btn-secondary" href={`businessprofile.html?id=${business.id}`}> visit profile </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
