import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import footprint from '../assets/footPrint.png';

const ApplyAdoption = ({ selectedRescue, setView }) => {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    message: ''
  });
  const [aadharPhoto, setAadharPhoto] = useState('');
  const [housePhotos, setHousePhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!selectedRescue) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-805 mb-2">No animal selected</h3>
        <button 
          onClick={() => setView('list')}
          className="mt-4 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2.5 px-6 rounded-full shadow transition cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAadharUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAadharPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHousePhotosUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHousePhotos(prev => [...prev, reader.result].slice(0, 4)); // Limit to max 4 photos
      };
      reader.readAsDataURL(file);
    });
  };

  const removeHousePhoto = (index) => {
    setHousePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadharPhoto) {
      setError('Please upload your Aadhar Card or ID proof.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/adoptions`, {
        rescueId: selectedRescue._id,
        phone: formData.phone,
        address: formData.address,
        message: formData.message,
        aadharPhoto,
        housePhotos
      });
      setSuccess(true);
      setTimeout(() => {
        setView('list');
      }, 3000);
    } catch (err) {
      console.error('Error submitting adoption application:', err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* Left Side Info Panel */}
        <div className="md:w-1/3 bg-orange-50/50 p-8 flex flex-col justify-between border-r border-gray-100">
          <div>
            <div className="flex items-center mb-6">
              <img src={footprint} alt="Paw" className="h-6 w-6 mr-2 opacity-50 rotate-12" />
              <span className="font-bold text-xs uppercase tracking-wider text-brand-primary">Adoption Portal</span>
            </div>
            <h2 className="text-3xl font-black text-brand-darkGrey leading-tight mb-4">
              Apply to Adopt {selectedRescue.title}
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              We take the safety of our rescues very seriously. Please fill out your details, upload your ID, and upload clear photos of your house environment (yard, living area) so our volunteers can vet the location.
            </p>
          </div>
          {selectedRescue.photoUrl && (
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative h-48 group">
              <img src={selectedRescue.photoUrl} alt={selectedRescue.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <span className="text-white text-xs font-bold bg-brand-primary px-2 py-0.5 rounded-full mr-2">Ready</span>
                <span className="text-white text-sm font-semibold">{selectedRescue.title}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Form Panel */}
        <div className="md:w-2/3 p-8 md:p-12">
          {success ? (
            <div className="text-center py-16 flex flex-col items-center justify-center h-full">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl shadow-inner animate-bounce mb-6">
                🎉
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Thank you for applying! We are redirecting you to the dashboard. Our volunteer will review your safety standards shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-xl font-bold text-gray-805 border-b pb-3 mb-6">Application Details</h3>
              
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-semibold border border-red-150 animate-pulse">
                  ⚠️ {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <input 
                    required 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleTextChange}
                    className="w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-sm" 
                    placeholder="E.g., +91 98765 43210" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Home Address</label>
                  <input 
                    required 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleTextChange}
                    className="w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-sm" 
                    placeholder="Street, Area, Flat number" 
                  />
                </div>
              </div>

              {/* ID Proof (Aadhar) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Aadhar Card / ID Proof (Required)</label>
                <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-brand-primary transition cursor-pointer relative overflow-hidden bg-gray-50/50">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleAadharUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                  />
                  {aadharPhoto ? (
                    <div className="flex flex-col items-center">
                      <img src={aadharPhoto} alt="Aadhar Preview" className="h-32 w-auto object-contain rounded-lg shadow-md border" />
                      <span className="text-xs text-brand-primary font-bold mt-2">Change Image</span>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <span className="font-bold text-brand-primary hover:underline">Upload ID Proof / Aadhar</span>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* House Photos (Multi) */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Photos of Your House (Living room, backyard, etc. - Max 4)</label>
                <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-brand-primary transition cursor-pointer relative overflow-hidden bg-gray-50/50 mb-4">
                  <input 
                    type="file" 
                    multiple
                    accept="image/*" 
                    onChange={handleHousePhotosUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                  />
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2 2l1.586-1.586a2 2 0 012.828 0L20 18M3 42h42a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v32a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <span className="font-bold text-brand-primary hover:underline">Upload House Environment Photos</span>
                    </div>
                    <p className="text-xs text-gray-500">Select multiple files</p>
                  </div>
                </div>
                {housePhotos.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {housePhotos.map((photo, index) => (
                      <div key={index} className="relative h-20 rounded-xl overflow-hidden border shadow-sm group">
                        <img src={photo} alt={`House ${index + 1}`} className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => removeHousePhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">About you & your lifestyle</label>
                <textarea
                  required
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleTextChange}
                  className="w-full border border-gray-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all text-sm leading-relaxed"
                  placeholder="E.g., Tell us if you work from home, have a fenced yard, family consensus, or other pets..."
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="flex-1 bg-gray-150 hover:bg-gray-200 text-gray-750 font-bold py-3.5 px-4 rounded-xl transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Submitting Application...' : 'Apply to Adopt'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ApplyAdoption;
