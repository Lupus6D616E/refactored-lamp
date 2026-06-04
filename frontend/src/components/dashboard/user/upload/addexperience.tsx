import { edenTreatyApi } from '@lib/eden';
import React, { useState } from 'react';

const AddExperienceCard: React.FC = () => {
  const [experience, setExperience] = useState('');
  const [position, setPosition] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await edenTreatyApi.user.addexperience.post({
        duration,
        experience,
        position
      })
      if (response.data) {
        setMessage('experience added successfully!');
        setExperience('');
        console.log('Response:', response.status);
      } else {
        setMessage('Failed to add item.');
      }
    } catch (error) {
      setMessage('Error: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="card bg-base-100 shadow-md p-6">
  {/* Header Style - Gayang-gaya sa General Info */}
  <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">
    Work Experience
  </h3>

  {isEditing ? (
    /* ================= EDIT MODE ================= */
    <div className="space-y-4">
      <div className="form-control">
        <label className="label-text font-bold text-xs uppercase">COMPANY / BUSINESS NAME</label>
        <input 
          className="input input-bordered input-sm" 
          placeholder="e.g. PC Worth"
          value={experience} 
          onChange={(e) => setExperience(e.target.value)} 
          disabled={loading}
        />
      </div>

      <div className="form-control">
        <label className="label-text font-bold text-xs uppercase">POSITION</label>
        <input 
          className="input input-bordered input-sm" 
          placeholder="e.g. IT Intern"
          value={position} 
          onChange={(e) => setPosition(e.target.value)} 
          disabled={loading}
        />
      </div>

      <div className="form-control">
        <label className="label-text font-bold text-xs uppercase">DURATION</label>
        <input 
          className="input input-bordered input-sm" 
          placeholder="e.g. 3 years / 6 months"
          value={duration} 
          onChange={(e) => setDuration(e.target.value)} 
          disabled={loading}
        />
      </div>

      {/* Button para sa save kung hiwalay ito ng save endpoint */}
      <button 
        type="button"
        className="btn btn-primary btn-sm w-full mt-2" 
        onClick={handleSubmit} 
        disabled={loading}
      >
        {loading ? "Saving..." : "Add Experience"}
      </button>
    </div>
  ) : (
    /* ================= VIEW MODE ================= */
    <div className="space-y-4">
      <div>
        <p className="text-xs font-bold opacity-60">PREVIOUS WORK EXPERIENCE</p>
        <p className="text-sm">{experience || "No work experience listed"}</p>
      </div>
      <div>
        <p className="text-xs font-bold opacity-60">POSITION</p>
        <p className="text-sm">{position || "No position listed"}</p>
      </div>
      <div>
        <p className="text-xs font-bold opacity-60">DURATION</p>
        <p className="text-sm">{duration || "No duration listed"}</p>
      </div>
    </div>
  )}

  {message && (
    <p className="text-center text-xs mt-4 opacity-70 italic">{message}</p>
  )}
</div>
  );
};

export default AddExperienceCard;