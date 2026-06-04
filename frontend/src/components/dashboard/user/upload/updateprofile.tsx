// src/components/PostCreator.tsx
import { useState } from "react";
import { edenTreatyApi } from "@lib/eden";
import { Map } from "@components/map/mappicker/map";
import { LatLngLiteral } from "leaflet";

export function UpdateProfile() {
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [position, setPosition] = useState<LatLngLiteral>({
    lat: 0,
    lng: 0,
  });
  const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const handleAddressUpdate = (address: string, point:LatLngLiteral) => {
    setAddress(address)
    setPosition(point)
  };

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const addskill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
      setSkillInput("");
    }
  };

  const removeskill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((t) => t !== skillToRemove));
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;

    try {
      const response = await edenTreatyApi.user.updateprofile.post({
        description,
        skills,
        selectedDays,
        address,
        education,
        location:position
      });

      if (response.error) {
        alert("Error: " + response.error.value);
        return;
      }

      // Success
      alert("Profile created successfully!");
      // Reset form
      setDescription("");
      setSkills([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    }
  };

  return (
    <div className="md:col-span-2 space-y-6">
  <div className="card bg-base-100 shadow-md p-8 border border-base-200/50">
    {/* Main Header */}
    <h2 className="card-title font-bold mb-6 pb-2 border-b text-xl tracking-tight uppercase opacity-50 tracking-widest">
      Edit Profile
    </h2>

    <div className="space-y-8">
      {/* Description Section */}
      <section>
        <h3 className="font-bold mb-3 text-xs uppercase opacity-50 tracking-widest">
          Description
        </h3>
        <textarea
          className="textarea textarea-bordered h-32 w-full text-sm break-all whitespace-pre-wrap overflow-y-auto focus:textarea-primary"
          placeholder="Tell us about yourself..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </section>

      {/* Education Section */}
      <section>
        <h3 className="font-bold mb-3 text-xs uppercase opacity-50 tracking-widest">
          Education
        </h3>
        <textarea
          className="textarea textarea-bordered h-32 w-full text-sm break-all whitespace-pre-wrap overflow-y-auto focus:textarea-primary"
          placeholder="List your academic background..."
          value={education}
          onChange={(e) => setEducation(e.target.value)}
        />
      </section>

      {/* Skills Section */}
      <section>
        <h3 className="font-bold mb-3 text-xs uppercase opacity-50 tracking-widest">
          Skills
        </h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              className="input input-bordered input-sm flex-1 focus:input-primary"
              placeholder="Add skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addskill();
                }
              }}
            />
            <button
              className="btn btn-primary btn-sm px-6 font-bold"
              onClick={addskill}
              disabled={!skillInput.trim()}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <div key={skill} className="badge badge-outline badge-secondary h-auto py-1.5 px-3 gap-2 text-[11px] font-semibold">
                  {skill}
                  <button
                    className="hover:text-error transition-colors font-bold text-xs"
                    onClick={() => removeskill(skill)}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs opacity-50 italic">No skills added yet</p>
            )}
          </div>
        </div>
      </section>

      {/* Original Style Map Section */}
      <section>
        <h3 className="font-bold mb-4 text-xs uppercase opacity-50 tracking-widest">
          Availability & Location
        </h3>
        <div className="space-y-6">
          <div className="form-control">
            <span className="label-text font-bold text-[10px] mb-3 uppercase opacity-60">Select Days:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <label key={day} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-base-200 transition-colors">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-xs"
                    checked={selectedDays.includes(day)}
                    onChange={() => toggleDay(day)}
                  />
                  <span className="text-xs">{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ibinasura ang modern filters, ibinalik sa basic clean map wrapper */}
          <div className="form-control space-y-3">
            <div className="rounded-lg overflow-hidden border border-base-200">
              <Map onAddressSelect={handleAddressUpdate} />
            </div>
            <input
              type="text"
              className="input input-bordered input-sm w-full bg-base-200/50"
              value={address}
              readOnly
              placeholder="Location Address"
            />
            <div className="flex justify-between items-center px-1">
               <p className="text-[10px] opacity-40 font-mono italic">
                Lat: {position.lat} | Lng: {position.lng}
              </p>
              <div className="text-[10px] font-bold opacity-60 uppercase">
                {selectedDays.length} days selected
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Action Button */}
      <div className="pt-6 border-t border-base-200">
        <button
          className="btn btn-primary btn-md w-full font-bold uppercase tracking-widest"
          onClick={handleSubmit}
          disabled={!description.trim() || !address.trim()}
        >
          Update Profile Information
        </button>
      </div>
    </div>
  </div>
</div>
  );
}
