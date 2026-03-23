import { edenTreatyApi } from '@lib/eden';
import React, { useState } from 'react';

const AddExperienceCard: React.FC = () => {
  const [experience, setExperience] = useState('');
  const [position, setPosition] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    <div className="card bg-base-100 w-96 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Add Previous Work Experience</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="previous work experience"
            required={true}
            className="input input-bordered w-full"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="position"
            required={true}
            className="input input-bordered w-full"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            disabled={loading}
          />
              <input
            type="text"
            placeholder="example: 3 years"
            required={true}
            className="input input-bordered w-full"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={loading}
          />
          <div className="card-actions">
            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? 'Adding...' : 'Submit'}
            </button>
          </div>
        </form>
        {message && <p className="text-center mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default AddExperienceCard;