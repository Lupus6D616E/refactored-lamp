import { useEffect, useState } from "react";
import { edenTreatyApi } from "@lib/eden";
import { Map } from "@components/map/mappicker/map";
import { LatLngLiteral } from "leaflet";
type business = {
  id: string;
  name: string | null;
};

export function CreateJobForm() {
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [businesses, setBusinesses] = useState<business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [city, setCity] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [minimumSalary, setSalary] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [inputTag, setInputTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState<LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
  const handleAddressUpdate = (address: string, point: LatLngLiteral) => {
    setAddress(address);
    setPosition(point);
  };
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

  const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchUserBusinesses = async () => {
      try {
        const res = await edenTreatyApi.business.mybusinesses.get();
        console.log(res);
        if (res.data !== null) {
          setBusinesses(res.data);
        }
      } catch (e) {
        console.log(e);
        setError("error");
      }
    };
    fetchUserBusinesses();
  }, []);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

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
    const data = {
      title: title,
      email: email,
      businessId: selectedBusiness,
      description: description,
      requirements: requirements,
      responsibilities: responsibilities,
      city: city,
      employmentType: employmentType,
      minimumSalary: parseFloat(minimumSalary),
      expireDate: new Date(expireDate),
      tags: tags,
      schedule: selectedDays,
      address: address,
      location: position,
    };
    const res = await edenTreatyApi.post.postjob.post(data);

    setLoading(false);

    if (!res.data) {
      setError("An error occurred idk");
      return;
    } else {
      const message = res.data;
      if (message.message === "no") {
        setError("JOB POSTED");
      } else {
        setError("An Error Occurred");
      }
    }
  }

  return (
<form onSubmit={handleSubmit} className="space-y-5 w-full">
  <div>
    <h2 className="text-xl font-bold mb-1">Job Details</h2>
    <p className="text-xs text-base-content/60">Provide the core information about the job opening.</p>
  </div>

  {/* Map Section */}
  <div className="form-control w-full bg-base-200 p-3 rounded-xl border border-base-300">
    <span className="label-text font-semibold mb-2 block text-xs">Job Location (Map)</span>
    <Map onAddressSelect={handleAddressUpdate} />
    <div className="mt-2 text-xs badge badge-ghost gap-1 p-2">
      <span className="font-semibold text-primary">Lat:</span> {position.lat}
      <span className="font-semibold text-primary ml-2">Lng:</span> {position.lng}
    </div>
  </div>

  {/* 2 Columns: Business & Title */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="form-control w-full">
      <label className="label py-1"><span className="label-text text-xs font-semibold">Business</span></label>
      <select
        required={true}
        value={selectedBusiness}
        onChange={(e) => setSelectedBusiness(e.target.value)}
        className="select select-bordered select-sm w-full"
      >
        <option disabled={true} value="">-- Select a business --</option>
        {businesses.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
    </div>

    <div className="form-control w-full">
      <label className="label py-1"><span className="label-text text-xs font-semibold">Job Title</span></label>
      <input
        type="text"
        placeholder="e.g. Driver, Clerk"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered input-sm w-full"
      />
    </div>
  </div>

  {/* 2 Columns: Email & Address */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="form-control w-full">
      <label className="label py-1"><span className="label-text text-xs font-semibold">Contact Email</span></label>
      <input
        type="email"
        placeholder="recruitment@email.com"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input input-bordered input-sm w-full"
      />
    </div>

    <div className="form-control w-full">
      <label className="label py-1"><span className="label-text text-xs font-semibold">Full Address</span></label>
      <input
        type="text"
        placeholder="Street, Barangay, City"
        required
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="input input-bordered input-sm w-full"
      />
    </div>
  </div>

  <div className="form-control w-full">
    <label className="label py-1"><span className="label-text text-xs font-semibold">Job Description</span></label>
    <textarea
      placeholder="Brief description of the role..."
      required
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="textarea textarea-bordered textarea-sm h-20 w-full"
    ></textarea>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="form-control w-full">
      <label className="label py-1"><span className="label-text text-xs font-semibold">Requirements</span></label>
      <textarea
        placeholder="Skills or experience needed..."
        required
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
        className="textarea textarea-bordered textarea-sm h-20 w-full"
      ></textarea>
    </div>

    <div className="form-control w-full">
      <label className="label py-1"><span className="label-text text-xs font-semibold">Responsibilities</span></label>
      <textarea
        placeholder="Key duties..."
        required
        value={responsibilities}
        onChange={(e) => setResponsibilities(e.target.value)}
        className="textarea textarea-bordered textarea-sm h-20 w-full"
      ></textarea>
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="form-control w-full">
      <label className="label py-1"><span className="label-text text-xs font-semibold">City</span></label>
      <select
        required={true}
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="select select-bordered select-sm w-full"
      >
        <option disabled={true} value="">-- Select a city --</option>
        {sortedItems.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>

    <div className="form-control w-full">
      <label className="label py-1"><span className="label-text text-xs font-semibold">Employment Type</span></label>
      <select
        required={true}
        value={employmentType}
        onChange={(e) => setEmploymentType(e.target.value)}
        className="select select-bordered select-sm w-full"
      >
        <option disabled={true} value="">-- Select type --</option>
        {employments.map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
      </select>
    </div>
  </div>


  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div className="form-control w-full">
      <label className="label py-1"><span className="label-text text-xs font-semibold">Expiry Date</span></label>
      <input
        type="date"
        className="input input-bordered input-sm w-full"
        min={minDate}
        value={expireDate}
        onChange={(e) => setExpireDate(e.target.value)}
        required
      />
    </div>

    <div className="form-control w-full">
      <label className="label py-1"><span className="label-text text-xs font-semibold">Minimum Salary</span></label>
      <input
        type="number"
        placeholder="₱ 0.00"
        min={0}
        required
        value={minimumSalary}
        onChange={(e) => setSalary(e.target.value)}
        className="input input-bordered input-sm w-full"
      />
    </div>
  </div>

  <div className="divider my-2"></div>


  <div className="form-control w-full">
    <label className="label py-1"><span className="label-text text-xs font-semibold">Job Tags</span></label>
    <div className="flex gap-2">
      <input
        type="text"
        value={inputTag}
        onChange={(e) => setInputTag(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. Urgent"
        className="input input-bordered input-sm flex-1"
        disabled={loading}
      />
      <button
        type="button"
        onClick={handleAddTag}
        className="btn btn-neutral btn-sm"
        disabled={!inputTag.trim() || loading}
      >
        Add
      </button>
    </div>
    <div className="flex flex-wrap gap-1.5 mt-2 p-2 bg-base-200/50 rounded-lg min-h-[40px] items-center">
      {tags.length === 0 ? (
        <p className="text-xs text-base-content/50 px-1">No tags.</p>
      ) : (
        tags.map((tag) => (
          <div key={tag} className="badge badge-sm badge-primary gap-1 py-2">
            {tag}
            <button type="button" onClick={() => handleRemoveTag(tag)} className="font-bold text-xs">✕</button>
          </div>
        ))
      )}
    </div>
  </div>

 
  <div className="form-control w-full bg-base-200/50 p-3 rounded-xl border border-base-300">
    <span className="label-text text-xs font-semibold mb-2 block">Work Days</span>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
      {DAYS_OF_WEEK.map((day) => (
        <label key={day} className="label cursor-pointer justify-start gap-2 bg-base-100 p-1.5 rounded border border-base-300">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-xs"
            checked={selectedDays.includes(day)}
            onChange={() => toggleDay(day)}
          />
          <span className="label-text text-xs">{day}</span>
        </label>
      ))}
    </div>
  </div>

  {error && <p className="text-red-500 text-xs">{error}</p>}

  <button type="submit" disabled={loading} className="btn btn-primary btn-sm w-full mt-2">
    {loading ? "Posting..." : "Post Job"}
  </button>
</form>
  );
}
