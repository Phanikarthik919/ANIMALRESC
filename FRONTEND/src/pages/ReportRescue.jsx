import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import sadDogImg from '../assets/sad_dog.png';
import happyDogImg from '../assets/happy_dog.png';

const ReportRescue = () => {
  const navigate = useNavigate();
  const { fetchRescues } = useOutletContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    locationAddress: '',
    needsDonation: false,
    photoUrl: '',
    lat: null,
    lng: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiTriageData, setAiTriageData] = useState(null);
  const [aiError, setAiError] = useState('');

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'Animal-Rescue-App/1.0'
        }
      });
      const data = await response.json();
      if (data && data.display_name) {
        setFormData(prev => ({
          ...prev,
          locationAddress: data.display_name
        }));
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          lat: latitude,
          lng: longitude
        }));

        if (map && marker) {
          map.setView([latitude, longitude], 16);
          marker.setLatLng([latitude, longitude]);
        }
        await reverseGeocode(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Could not retrieve your location. Please check browser permissions.');
      },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    // Initial standard coordinates: Mumbai [19.0760, 72.8777]
    const defaultLat = 19.0760;
    const defaultLng = 72.8777;

    setTimeout(() => {
      if (!window.L) return;

      const container = document.getElementById('map-container');
      if (!container) return;

      const mapInstance = window.L.map('map-container').setView([defaultLat, defaultLng], 13);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance);

      const markerInstance = window.L.marker([defaultLat, defaultLng], { draggable: true }).addTo(mapInstance);

      setMap(mapInstance);
      setMarker(markerInstance);
      setFormData(prev => ({
        ...prev,
        lat: defaultLat,
        lng: defaultLng
      }));

      markerInstance.on('dragend', async () => {
        const position = markerInstance.getLatLng();
        setFormData(prev => ({
          ...prev,
          lat: position.lat,
          lng: position.lng
        }));
        await reverseGeocode(position.lat, position.lng);
      });

      mapInstance.on('click', async (e) => {
        const position = e.latlng;
        markerInstance.setLatLng(position);
        setFormData(prev => ({
          ...prev,
          lat: position.lat,
          lng: position.lng
        }));
        await reverseGeocode(position.lat, position.lng);
      });
    }, 100);
  }, []);

  const triggerAiTriage = async (imageUrl) => {
    if (!imageUrl) return;
    setIsAnalyzingAI(true);
    setAiError('');
    try {
      const res = await axios.post(`${API_URL}/api/rescues/ai-triage`, { photoUrl: imageUrl });
      setAiTriageData(res.data);
      
      // Auto-populate title & description if currently blank
      if (res.data.isAnimalDetected) {
        setFormData(prev => ({
          ...prev,
          title: prev.title.trim() ? prev.title : (res.data.suggestedTitle || prev.title),
          description: prev.description.trim() ? prev.description : (res.data.suggestedDescription || prev.description),
          needsDonation: (res.data.severity === 'Critical' || res.data.severity === 'High') ? true : prev.needsDonation
        }));
      }
    } catch (err) {
      console.error('AI Triage failed:', err);
      const msg = err.response?.data?.message || err.message || 'Service unreachable';
      setAiError(`AI Analysis Notice: ${msg}`);
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleApplyAiSuggestions = () => {
    if (!aiTriageData) return;
    setFormData(prev => ({
      ...prev,
      title: aiTriageData.suggestedTitle || prev.title,
      description: `${aiTriageData.suggestedDescription || ''}\n\n📋 Clinical Observation: ${aiTriageData.clinicalNotes || 'Observed via AI Vision'}`,
      needsDonation: (aiTriageData.severity === 'Critical' || aiTriageData.severity === 'High' || aiTriageData.recommendedDonationGoal > 0)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/rescues`, {
        title: formData.title,
        description: formData.description,
        location: {
          address: formData.locationAddress,
          lat: formData.lat,
          lng: formData.lng
        },
        needsDonation: formData.needsDonation,
        donationAmountNeeded: formData.needsDonation ? (aiTriageData?.recommendedDonationGoal || 1500) : 0,
        photoUrl: formData.photoUrl,
        aiTriage: aiTriageData || undefined
      });
      if (fetchRescues) await fetchRescues();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/');
    } catch (error) {
      console.error('Failed to submit rescue report:', error);
      alert('Failed to submit. Please ensure backend is running.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imgData = reader.result;
          setFormData(prev => ({ ...prev, photoUrl: imgData }));
          triggerAiTriage(imgData);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  return (
    <div className="px-4 py-8 sm:px-0 w-full mx-auto">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Side: Cartoon Image & AI Badge */}
        <div className="md:w-5/12 bg-gradient-to-b from-orange-50 via-amber-50 to-orange-100 flex flex-col justify-between items-center p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-primaryLight rounded-full blur-3xl opacity-20 transform -translate-y-10 scale-150"></div>
          
          <div className="z-10 text-center w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-brand-primary font-bold text-xs uppercase tracking-wider mb-3">
              <span>⚡ Powered by Google Gemini AI</span>
            </div>
            <h2 className="text-3xl font-extrabold text-brand-primary mb-3">
              {isSubmitting ? "Thank You!" : "AI Rapid Response"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isSubmitting 
                ? "Help is on the way. Our AI has prioritized this case for nearby volunteers." 
                : "Upload a photo and our AI Veterinary Triage Engine will automatically assess injury severity and emergency priority."}
            </p>
          </div>

          <div className="my-6 z-10 w-full flex justify-center">
            <img 
              src={isSubmitting ? happyDogImg : sadDogImg} 
              alt="Rescue Animal Cartoon" 
              className={`w-full max-w-xs object-contain drop-shadow-xl transition-all duration-700 ${isSubmitting ? 'scale-110' : 'hover:scale-105'}`} 
            />
          </div>

          {/* Quick patent novelty banner */}
          <div className="z-10 w-full bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-200/60 shadow-sm text-left">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-800 mb-1">
              <span className="text-base">🔬</span>
              <span>Visual Triage & Priority Dispatch</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Every uploaded photo undergoes computer vision triage to rank urgent life-threatening injuries at the top of the volunteer dispatch queue.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 md:p-12">
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold text-brand-darkGrey">Report a Rescue Need</h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full">
              Automated Triage Ready
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Photo Upload with AI Scanner */}
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-800">
                  📸 Upload Animal Photo <span className="text-brand-primary font-normal text-xs">(AI Triage Enabled)</span>
                </label>
                {formData.photoUrl && !isAnalyzingAI && (
                  <button
                    type="button"
                    onClick={() => triggerAiTriage(formData.photoUrl)}
                    className="text-xs text-brand-primary hover:underline font-bold flex items-center gap-1"
                  >
                    <span>🔄 Re-analyze with AI</span>
                  </button>
                )}
              </div>

              <input 
                type="file" 
                accept="image/*" 
                onChange={handleChange} 
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-brand-primary file:text-white hover:file:bg-brand-primaryDark cursor-pointer" 
              />

              {/* AI Analyzing Spinner */}
              {isAnalyzingAI && (
                <div className="mt-4 p-4 bg-orange-50/90 border border-orange-200 rounded-xl flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                  <div>
                    <h4 className="text-sm font-bold text-brand-primary">Scanning with Gemini Vision AI...</h4>
                    <p className="text-xs text-gray-600">Detecting species, breed, trauma severity, and emergency priority score.</p>
                  </div>
                </div>
              )}

              {/* AI Triage Result Card */}
              {aiTriageData && !isAnalyzingAI && (
                <div className="mt-4 bg-white border-2 border-orange-200 rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🩺</span>
                      <span className="font-extrabold text-sm text-gray-900">AI Triage Diagnostic Report</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        aiTriageData.severity === 'Critical' ? 'bg-red-500 text-white animate-pulse' :
                        aiTriageData.severity === 'High' ? 'bg-orange-500 text-white' :
                        aiTriageData.severity === 'Medium' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {aiTriageData.severity} Severity • Score {aiTriageData.triageScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-50 p-2.5 rounded-lg">
                      <span className="text-gray-500 block font-medium">Species & Breed</span>
                      <span className="font-bold text-gray-800 text-sm">
                        {aiTriageData.species} {aiTriageData.breedEstimation ? `(${aiTriageData.breedEstimation})` : ''}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2.5 rounded-lg">
                      <span className="text-gray-500 block font-medium">Injury Classification</span>
                      <span className="font-bold text-gray-800 text-sm">
                        {aiTriageData.injuryType || 'No apparent trauma'}
                      </span>
                    </div>
                  </div>

                  {aiTriageData.clinicalNotes && (
                    <div className="text-xs text-gray-700 bg-amber-50/60 p-3 rounded-lg border border-amber-100">
                      <span className="font-bold text-amber-900 block mb-1">🔍 Clinical Observation:</span>
                      {aiTriageData.clinicalNotes}
                    </div>
                  )}

                  {aiTriageData.suggestedFirstAid && aiTriageData.suggestedFirstAid !== 'N/A' && (
                    <div className="text-xs text-emerald-900 bg-emerald-50/70 p-3 rounded-lg border border-emerald-200">
                      <span className="font-bold block mb-1 flex items-center gap-1">
                        <span>🩹</span> Immediate First-Aid Guide for Bystander:
                      </span>
                      {aiTriageData.suggestedFirstAid}
                    </div>
                  )}

                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={handleApplyAiSuggestions}
                      className="text-xs bg-orange-100 hover:bg-brand-primary hover:text-white text-brand-primary font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>✨ Auto-Fill Title & Description from AI</span>
                    </button>
                  </div>
                </div>
              )}

              {aiError && (
                <p className="mt-2 text-xs text-red-500">{aiError}</p>
              )}

              {formData.photoUrl && (
                <div className="mt-3">
                  <img src={formData.photoUrl} alt="Preview" className="h-28 w-28 object-cover rounded-xl shadow-md border border-gray-200" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors text-sm" placeholder="E.g., Injured stray cat on Main St." />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea required rows="4" name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors text-sm" placeholder="Provide detailed information about the animal's condition and exact location..."></textarea>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">Drop a Pin on the Precise Location</label>
                <button 
                  type="button" 
                  onClick={handleLocateMe}
                  className="text-xs bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-1.5 px-3 rounded-full shadow-sm flex items-center transition cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  Locate Me
                </button>
              </div>
              <div id="map-container" className="h-64 w-full rounded-xl border border-gray-300 shadow-inner z-10 relative overflow-hidden mb-4" style={{ minHeight: '260px' }}></div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Location (Address)</label>
              <input required type="text" name="locationAddress" value={formData.locationAddress} onChange={handleChange} className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors text-sm" placeholder="E.g., Click the map above or enter address" />
            </div>

            <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input id="needsDonation" name="needsDonation" type="checkbox" checked={formData.needsDonation} onChange={handleChange} className="h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded cursor-pointer" />
              <label htmlFor="needsDonation" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer">
                This animal needs emergency medical donations
              </label>
            </div>
            
            <div className="pt-2">
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-brand-primary hover:bg-brand-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 transition-all transform hover:-translate-y-1 cursor-pointer">
                {isSubmitting ? 'Submitting & Dispatching...' : 'Submit Rescue Report'}
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default ReportRescue;
