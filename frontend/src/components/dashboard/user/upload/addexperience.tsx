import React, { useState } from 'react';

const AddExperienceCard: React.FC = () => {
  const [experience, setExperience] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/user/addexperience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ experience, position }), 
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Certification added successfully!');
        setExperience('');
        console.log('Response:', data);
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