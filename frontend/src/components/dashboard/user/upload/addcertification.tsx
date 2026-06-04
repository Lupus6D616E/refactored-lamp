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
    <div className="card bg-base-100 shadow-md p-6 border border-base-200">
  {/* Header Style */}
  <h3 className="font-bold border-b mb-4 pb-1 text-xs uppercase opacity-50 tracking-widest">
    Certifications
  </h3>

  <form onSubmit={handleSubmit} className="space-y-6">
    <div className="form-control w-full space-y-4">
      {/* Label Section */}
      <div className="space-y-1">
        <h2 className="text-sm font-bold uppercase tracking-tight">Add New Certification</h2>
        <p className="text-xs opacity-60 leading-relaxed">
          Enter the title of your professional certificate or award.
        </p>
      </div>
      
      {/* Input Field: Nilagyan ko ng break-all para safety */}
      <input
        type="text"
        placeholder="e.g. TESDA NC II Certified"
        required={true}
        className="input input-bordered input-sm w-full focus:outline-primary transition-all break-all"
        value={certification}
        onChange={(e) => setCertification(e.target.value)}
        disabled={loading}
      />
    </div>

    {/* Action Button */}
    <div className="card-actions">
      <button 
        type="submit" 
        className="btn btn-primary btn-sm w-full font-bold transition-transform active:scale-95" 
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loading loading-spinner loading-xs mr-2"></span>
            Adding...
          </>
        ) : (
          'Add Certification'
        )}
      </button>
    </div>
  </form>

  {/* Status Message */}
  {message && (
    <div className={`mt-4 p-2 rounded-lg text-xs text-center font-medium border animate-pulse ${
      message.includes('success') 
        ? 'bg-success/10 text-success border-success/20' 
        : 'bg-error/10 text-error border-error/20'
    }`}>
      {message}
    </div>
  )}
</div>
  );
};

export default AddCertificationCard;