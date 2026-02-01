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
    <div className="max-w-2xl mx-auto p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body gap-6">
          <h2 className="card-title">Change Profile</h2>

          {/* Textarea */}
          <div className="form-control">
            <textarea
              className="textarea textarea-bordered textarea-lg min-h-[140px]"
              placeholder="Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-control">
            <textarea
              className="textarea textarea-bordered textarea-lg min-h-[140px]"
              placeholder="education..."
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </div>
          {/* skills input */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">skills</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="input input-bordered flex-1"
                placeholder="Add skill... (press add or enter)"
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
                className="btn btn-outline btn-primary"
                onClick={addskill}
                disabled={!skillInput.trim()}
              >
                Add
              </button>
            </div>

            {/* skills display */}
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill) => (
                <div key={skill} className="badge badge-outline gap-2">
                  {skill}
                  <button
                    className="btn btn-xs btn-ghost btn-circle"
                    onClick={() => removeskill(skill)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="form-control gap-2">
            <span className="label-text font-semibold">Select days</span>

            {DAYS_OF_WEEK.map((day) => (
              <label
                key={day}
                className="label cursor-pointer justify-start gap-3"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={selectedDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                <span className="label-text">{day}</span>
              </label>
            ))}

            {/* Debug / preview */}
            <div className="mt-2 text-sm opacity-70">
              Selected: {selectedDays.join(", ") || "None"}
            </div>
          </div>
          <Map onAddressSelect={handleAddressUpdate} />
          <input
            type="text"
            className="input input-bordered flex-1"
            placeholder="Click on Search button to find Address"
            value={address}
            disabled={true}
          ></input>
          <p>lat{position.lat} lng:{position.lng}</p>
          {/* Submit */}
          <div className="card-actions justify-end mt-4">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!description.trim() || !address.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
