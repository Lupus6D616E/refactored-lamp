import React, { useState } from 'react';

const AddCertificationCard: React.FC = () => {
  const [certification, setCertification] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certification.trim()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/user/addcertification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certification }), 
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Certification added successfully!');
        setCertification('');
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
        <h2 className="card-title">Add Certification</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Certification"
            required={true}
            className="input input-bordered w-full"
            value={certification}
            onChange={(e) => setCertification(e.target.value)}
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

export default AddCertificationCard;