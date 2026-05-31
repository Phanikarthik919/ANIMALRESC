import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';

const AdoptionModal = ({ rescue, onClose, onApplied }) => {
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API_URL}/api/adoptions`, {
        rescueId: rescue._id,
        phone,
        address,
        message
      });
      setSuccess(true);
      if (onApplied) onApplied();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-150 transform scale-100 transition-transform">
        <div className="bg-brand-primary text-white p-6 flex justify-between items-center relative">
          <div>
            <h3 className="text-2xl font-bold">Adopt {rescue.title}</h3>
            <p className="text-sm font-semibold opacity-85 mt-1">Submit your application to become their forever family</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-brand-darkGrey hover:text-black focus:outline-none p-1.5 rounded-full hover:bg-white/20 transition cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner animate-bounce">
                🎉
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h4>
              <p className="text-gray-500">Thank you for opening your heart. The caring volunteer will review your application soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-150">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-sm" 
                    placeholder="E.g., +91 98765 43210" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Home Address</label>
                  <input 
                    required 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    className="w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-sm" 
                    placeholder="E.g., Flat 302, Green Meadows, Bandra West" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  About you & your home environment:
                </label>
                <textarea
                  required
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl shadow-sm py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-sm leading-relaxed"
                  placeholder="Tell us if you have experience with pets, other animals at home, garden/yard space, and why you want to adopt..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-750 font-bold py-3.5 px-4 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdoptionModal;
