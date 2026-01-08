import { useState } from "react";
import { authClient } from "@lib/auth-client"; // your BetterAuth client

export function CreateJobForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [city, setCity] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [minimumSalary, setSalary] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cities = [
    "Manila",
    "Caloocan",
    "Las Piñas",
    "Makati",
    "Malabon",
    "Mandaluyong",
    "Marikina",
    "Muntinlupa",
    "Navotas",
    "Parañaque",
    "Pasay",
    "Quezon City",
    "San Juan",
    "Taguig",
    "Valenzuela",
    "Pateros",
  ];
  const sortedItems = [...cities].sort();
  const employments = ["Full Time", "Part Time", "Internship"];

  // Calculate the minimum date: today + 7 days
  const today = new Date();
  today.setDate(today.getDate() + 7);
  const minDate = today.toISOString().split("T")[0];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddTag = () => {
    const trimmedtag = inputTag.trim();
    if (trimmedtag && !tags.includes(trimmedtag)) {
      setTags([...tags, trimmedtag]);
      setInputTag("");
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/postjob", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        responsibilities: responsibilities,
        city: city,
        employmentType: employmentType,
        minimumSalary: minimumSalary,
        expireDate: expireDate,
        tags: tags,
      }),
    });

    setLoading(false);

    if (!response.ok) {
      setError(response.statusText);
      return;
    } else {
      const message = await response.json();
      if ((message.yes = "no")) setError("job posted");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <h1 className="text-xl font-semibold">Create a post</h1>

      <input
        type="text"
        placeholder="title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <textarea
        placeholder="description"
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border p-2 rounded"
      ></textarea>
      <textarea
        placeholder="responsibilities"
        required
        value={responsibilities}
        onChange={(e) => setResponsibilities(e.target.value)}
        className="w-full border p-2 rounded"
      ></textarea>
      <select
        required={true}
        value={city}
        onChange={(e) => setCity(e.target.value)}
      >
        <option disabled={true} value="">
          -- Select a city --
        </option>
        {sortedItems.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <select
        required={true}
        value={employmentType}
        onChange={(e) => setEmploymentType(e.target.value)}
      >
        <option disabled={true} value="">
          -- Select employment type --
        </option>
        {employments.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      <label className="label">
        <span className="label-text">
          Choose an expiry date (at least 1 week ahead)
        </span>
      </label>
      <input
        type="date"
        className="input input-bordered"
        min={minDate}
        value={expireDate}
        onChange={(e) => setExpireDate(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="minimum salary"
        min={0}
        required
        value={minimumSalary}
        onChange={(e) => setSalary(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a tag..."
          className="input input-bordered flex-1"
          disabled={loading}
        />
        <button
          onClick={handleAddTag}
          className="btn btn-primary"
          disabled={!inputTag.trim() || loading}
        >
          Add Tag
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {tags.length === 0 ? (
          <p className="text-base-content/60">No tags added yet.</p>
        ) : (
          tags.map((tag) => (
            <div key={tag} className="badge badge-lg badge-primary gap-2">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="text-white hover:text-red-300"
                disabled={loading}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white p-2 rounded"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
