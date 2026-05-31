import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import sadDogImg from '../assets/sad_dog.png';
import happyDogImg from '../assets/happy_dog.png';

const ReportRescue = ({ setView, refreshRescues }) => {
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

    // Use a small timeout to make sure Leaflet is available in index.html and container is rendered
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
        donationAmountNeeded: formData.needsDonation ? 500 : 0, // Default goal for now
        photoUrl: formData.photoUrl
      });
      if (refreshRescues) await refreshRescues();
      
      // Keep the happy dog on screen for 2 seconds so the user can see it!
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setView('list'); // Redirect to dashboard
    } catch (error) {
      console.error('Failed to submit rescue report:', error);
      alert('Failed to submit. Please ensure backend is running.');
      setIsSubmitting(false); // Only set back to false if failed. If success, we unmount anyway.
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, photoUrl: reader.result }));
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
        
        {/* Left Side: Cartoon Image */}
        <div className="md:w-5/12 bg-orange-50 flex flex-col justify-center items-center p-10 relative overflow-hidden transition-colors duration-1000">
          <div className="absolute inset-0 bg-brand-primaryLight rounded-full blur-3xl opacity-30 transform -translate-y-10 scale-150"></div>
          <h2 className="text-3xl font-extrabold text-brand-primary mb-6 text-center z-10">
            {isSubmitting ? "Thank You!" : "Be Their Hero"}
          </h2>
          <p className="text-gray-600 text-center mb-8 z-10">
            {isSubmitting ? "Help is on the way. We couldn't do this without you." : "Every second counts. Report an animal in need, and our rapid response team will take it from here."}
          </p>
          <img 
            src={isSubmitting ? happyDogImg : sadDogImg} 
            alt="Rescue Animal Cartoon" 
            className={`w-full max-w-sm object-contain z-10 drop-shadow-xl transition-all duration-1000 ${isSubmitting ? 'scale-110' : 'hover:scale-105'}`} 
          />
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-brand-darkGrey mb-8 border-b pb-4">Report a Rescue Need</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors" placeholder="E.g., Injured stray cat on Main St." />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <textarea required rows="4" name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors" placeholder="Provide detailed information about the animal's condition and exact location..."></textarea>
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
              <input required type="text" name="locationAddress" value={formData.locationAddress} onChange={handleChange} className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-brand-primary focus:border-brand-primary transition-colors" placeholder="E.g., Click the map above or enter address" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload an Image (Optional)</label>
              <input type="file" accept="image/*" onChange={handleChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-brand-primary hover:file:bg-orange-100 cursor-pointer" />
              {formData.photoUrl && (
                <div className="mt-4">
                  <img src={formData.photoUrl} alt="Preview" className="h-32 w-32 object-cover rounded-xl shadow-md border border-gray-200" />
                </div>
              )}
            </div>

            <div className="flex items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input id="needsDonation" name="needsDonation" type="checkbox" checked={formData.needsDonation} onChange={handleChange} className="h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded cursor-pointer" />
              <label htmlFor="needsDonation" className="ml-3 block text-sm font-medium text-gray-900 cursor-pointer">
                This animal needs medical donations
              </label>
            </div>
            
            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-brand-primary hover:bg-brand-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50 transition-all transform hover:-translate-y-1">
                {isSubmitting ? 'Submitting Report...' : 'Submit Rescue Report'}
              </button>
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default ReportRescue;
