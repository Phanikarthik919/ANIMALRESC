import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import footprint from '../assets/footPrint.png';
import { AuthContext } from '../context/AuthContext';

const ReviewAdoptions = () => {
  const navigate = useNavigate();
  const { selectedRescue, setSelectedRescue } = useOutletContext();
  const { user } = useContext(AuthContext);
  
  // State
  const [applications, setApplications] = useState([]);
  const [rescuesList, setRescuesList] = useState([]);
  const [myReportedRescues, setMyReportedRescues] = useState([]);
  
  // Filters
  const [activeTab, setActiveTab] = useState('Pending'); // Pending, Approved, Rejected
  const [animalFilter, setAnimalFilter] = useState(selectedRescue?._id || 'All');
  
  const [selectedApp, setSelectedApp] = useState(null);
  
  const [loadingApps, setLoadingApps] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [zoomImage, setZoomImage] = useState(null);
  const [error, setError] = useState('');

  // Safety checks
  const [checks, setChecks] = useState({
    secureFencing: false,
    noHazards: false,
    caretakerCommitted: false,
    consentHomeChecks: false
  });

  const allChecksPassed = checks.secureFencing && checks.noHazards && checks.caretakerCommitted && checks.consentHomeChecks;

  const fetchData = async () => {
    if (!user) return;
    setLoadingApps(true);
    setError('');
    try {
      // 1. Get all rescues first to build the filter dropdown properly
      const rescuesRes = await axios.get(`${API_URL}/api/rescues`);
      const currentUserId = user.id || user._id;
      let filteredRescues = rescuesRes.data.filter(r => {
        if (r.status !== 'Ready for Adoption' && r.status !== 'Rehomed') return false;
        if (user.role === 'admin') return true;
        const claimedById = r.claimedBy && (typeof r.claimedBy === 'object' ? (r.claimedBy._id || r.claimedBy.id) : r.claimedBy);
        return claimedById === currentUserId;
      });
      setRescuesList(filteredRescues);

      // Filter rescues reported by the current user
      if (user.role === 'user') {
        const reported = rescuesRes.data.filter(r => {
          if (!r.reportedBy) return false;
          const reportedById = typeof r.reportedBy === 'object' ? (r.reportedBy._id || r.reportedBy.id) : r.reportedBy;
          return reportedById === currentUserId;
        });
        setMyReportedRescues(reported);
      }

      // 2. Get all applications
      const appsRes = await axios.get(`${API_URL}/api/adoptions`);
      setApplications(appsRes.data);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // When filters change, clear selected app if it's no longer in the filtered list
  useEffect(() => {
    setSelectedApp(null);
  }, [activeTab, animalFilter]);

  const selectApplication = (app) => {
    setSelectedApp(app);
    setChecks({
      secureFencing: app.safetyChecks?.secureFencing || false,
      noHazards: app.safetyChecks?.noHazards || false,
      caretakerCommitted: app.safetyChecks?.caretakerCommitted || false,
      consentHomeChecks: app.safetyChecks?.consentHomeChecks || false
    });
  };

  // 3. Handle check changes
  const handleCheckChange = async (field) => {
    const updatedChecks = { ...checks, [field]: !checks[field] };
    setChecks(updatedChecks);
    
    try {
      await axios.put(`${API_URL}/api/adoptions/${selectedApp._id}/status`, {
        safetyChecks: updatedChecks
      });
      // Update app object in local list
      setApplications(prev => prev.map(a => a._id === selectedApp._id ? { ...a, safetyChecks: updatedChecks } : a));
    } catch (error) {
      console.error('Failed to update safety check:', error);
    }
  };

  // 4. Approve / Reject Application
  const handleDecision = async (statusValue) => {
    if (statusValue === 'Approved' && !allChecksPassed) {
      alert('Cannot approve. All safety standards checklist conditions must be checked.');
      return;
    }

    setUpdating(true);
    try {
      await axios.put(`${API_URL}/api/adoptions/${selectedApp._id}/status`, {
        status: statusValue
      });
      alert(`Application successfully ${statusValue.toLowerCase()}!`);
      // Reload applications and rescues
      fetchData();
    } catch (error) {
      console.error('Error updating application status:', error);
      alert(error.response?.data?.message || 'Failed to update application.');
    } finally {
      setUpdating(false);
    }
  };

  // Compute filtered list
  const filteredApps = applications.filter(app => {
    const matchesTab = app.status === activeTab;
    const matchesAnimal = animalFilter === 'All' || app.rescue?._id === animalFilter;
    return matchesTab && matchesAnimal;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'Rescued from Location': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Rescued and Treated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Ready for Adoption': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rehomed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Title */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div className="flex items-center">
          <img src={footprint} alt="Paw" className="h-8 w-8 mr-3 opacity-50 rotate-12" />
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            {user?.role === 'user' ? 'My Adoptions' : 'Rescue Vetting Portal'}
          </h2>
        </div>
        <button 
          onClick={() => {
            if (setSelectedRescue) setSelectedRescue(null);
            navigate('/');
          }}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-5 rounded-full transition cursor-pointer text-sm shadow-sm"
        >
          Back to Dashboard
        </button>
      </div>

      {/* My Reported Rescues Section (only for regular users) */}
      {user?.role === 'user' && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📢 My Reported Rescues
            <span className="text-xs font-bold bg-brand-primary/10 text-brand-primary px-2.5 py-1 rounded-full">{myReportedRescues.length}</span>
          </h3>
          {myReportedRescues.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
              <span className="text-3xl mb-2 block">🐾</span>
              <p className="text-sm text-gray-500 font-medium">You haven't reported any rescues yet.</p>
              <button
                onClick={() => navigate('/new')}
                className="mt-4 bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2 px-6 rounded-full text-sm transition shadow-sm"
              >
                Report a Rescue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myReportedRescues.map(rescue => (
                <div key={rescue._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
                    {rescue.photoUrl ? (
                      <img src={rescue.photoUrl} alt={rescue.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🐾</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{rescue.title}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getStatusColor(rescue.status)}`}>
                        {rescue.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">{rescue.location?.address || 'Unknown location'}</p>
                    {rescue.claimedBy && rescue.claimedBy.name && (
                      <p className="text-[11px] text-brand-primary font-semibold">👤 Volunteer: {rescue.claimedBy.name}</p>
                    )}
                    <p className="text-[10px] text-gray-400 mt-2">Reported on {new Date(rescue.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filter and Tabs Section */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          
          {/* Tabs */}
          <div className="flex space-x-2 bg-gray-50 p-1 rounded-xl">
            {['Pending', 'Approved', 'Rejected'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-brand-primary shadow-sm border border-gray-200' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab} Adoptions
                {/* Count Badge */}
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                  {applications.filter(a => a.status === tab && (animalFilter === 'All' || a.rescue?._id === animalFilter)).length}
                </span>
              </button>
            ))}
          </div>

          {/* Animal Dropdown Filter (Hidden for users) */}
          {user?.role !== 'user' && (
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <label className="font-bold text-gray-500 text-xs whitespace-nowrap">Filter by Animal:</label>
              <select 
                value={animalFilter}
                onChange={(e) => setAnimalFilter(e.target.value)}
                className="w-full lg:w-64 border border-gray-300 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm font-bold bg-white"
              >
                <option value="All">🐾 All Animals</option>
                {rescuesList.map(r => (
                  <option key={r._id} value={r._id}>
                    {r.title} {r.status === 'Rehomed' ? '🎉 (Rehomed)' : `(${r.status})`}
                  </option>
                ))}
              </select>
            </div>
          )}

        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Panel: Applicants List */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-gray-805 flex items-center justify-between">
            {activeTab} {user?.role === 'user' ? 'Applications' : 'Applicants'}
          </h3>
          
          {error && (
            <div className="bg-red-50 text-red-650 p-4 rounded-xl text-sm font-semibold border border-red-200">
              ⚠️ {error}
            </div>
          )}
          
          {loadingApps ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center shadow-sm">
              <span className="text-3xl animate-bounce inline-block">🐾</span>
              <p className="text-sm text-gray-500 mt-2 animate-pulse">Loading applications...</p>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center shadow-sm">
              <span className="text-3xl">🐾</span>
              <p className="text-sm text-gray-500 mt-2">No {activeTab.toLowerCase()} applications found.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1 pb-4">
              {filteredApps.map(app => (
                <div 
                  key={app._id}
                  onClick={() => selectApplication(app)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm relative overflow-hidden ${
                    selectedApp?._id === app._id 
                      ? 'bg-orange-50 border-brand-primary shadow-md' 
                      : 'bg-white border-gray-150 hover:bg-gray-50'
                  }`}
                >
                  {/* Small top accent line based on status */}
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    app.status === 'Approved' ? 'bg-green-400' :
                    app.status === 'Rejected' ? 'bg-red-400' :
                    'bg-brand-primary'
                  }`} />

                  <div className="mt-1 flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-gray-900 text-sm block">
                        {user?.role === 'user' ? app.rescue?.title : app.applicant?.name}
                      </span>
                      <span className="text-[11px] font-bold text-brand-primary">
                        {user?.role === 'user' ? 'My Application' : `For: ${app.rescue?.title || 'Unknown Animal'}`}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                      app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{app.applicant?.email}</p>
                  <p className="text-[10px] text-gray-400 mt-2">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel: Vetting & Safety Checklist */}
        <div className="lg:w-2/3">
          {selectedApp ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-8 md:p-10 space-y-8">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-start border-b pb-4 gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-905">
                    {user?.role === 'user' ? selectedApp.rescue?.title : selectedApp.applicant?.name}
                  </h3>
                  {user?.role !== 'user' && (
                    <p className="text-sm text-gray-500 mt-1">📧 {selectedApp.applicant?.email}  |  📞 <a href={`tel:${selectedApp.phone}`} className="text-blue-600 hover:underline">{selectedApp.phone}</a></p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="text-sm font-bold bg-orange-50 text-brand-primary border border-orange-100 px-4 py-1.5 rounded-xl flex items-center gap-2">
                    🐾 Animal: {selectedApp.rescue?.title}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold bg-gray-50 border px-4 py-1.5 rounded-xl">
                    🏠 Home: <span className="text-gray-800 font-bold">{selectedApp.address}</span>
                  </div>
                </div>
              </div>

              {/* Adopter Message */}
              {user?.role !== 'user' && (
                <div>
                  <h4 className="text-sm font-bold text-gray-700 mb-2">Adopter Background:</h4>
                  <p className="text-sm text-gray-600 italic bg-gray-50/50 p-4 rounded-2xl border border-gray-150 leading-relaxed whitespace-pre-line">
                    "{selectedApp.message || 'No description provided.'}"
                  </p>
                </div>
              )}

              {/* Photos Display */}
              {user?.role !== 'user' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Aadhar ID Proof */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3">ID / Aadhar Verification:</h4>
                    {selectedApp.aadharPhoto ? (
                      <div 
                        onClick={() => setZoomImage(selectedApp.aadharPhoto)}
                        className="h-44 w-full rounded-2xl overflow-hidden border shadow-sm cursor-zoom-in relative group"
                      >
                        <img src={selectedApp.aadharPhoto} alt="Aadhar Card" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5">
                          🔍 Zoom ID
                        </div>
                      </div>
                    ) : (
                      <div className="h-44 w-full rounded-2xl bg-gray-50 border border-dashed flex items-center justify-center text-xs text-gray-400">
                        No ID Proof Uploaded
                      </div>
                    )}
                  </div>

                  {/* House Photos */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-700 mb-3">House Environment Verification:</h4>
                    {selectedApp.housePhotos && selectedApp.housePhotos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {selectedApp.housePhotos.map((photo, index) => (
                          <div 
                            key={index} 
                            onClick={() => setZoomImage(photo)}
                            className="h-20 rounded-xl overflow-hidden border shadow-sm cursor-zoom-in relative group"
                          >
                            <img src={photo} alt={`House ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] font-bold">
                              🔍 Zoom
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-44 w-full rounded-2xl bg-gray-50 border border-dashed flex items-center justify-center text-xs text-gray-400">
                        No House Photos Uploaded
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Vetting Checklist */}
              {user?.role !== 'user' ? (
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-6 md:p-8 space-y-4">
                  <h4 className="text-base font-extrabold text-brand-primary mb-4 flex items-center gap-1.5">
                    🛡️ Safety Standards Vetting Checklist
                  </h4>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                    Verify the applicant's photos and details against the safety conditions. Ticking a checkbox saves it automatically. All checkboxes must be completed to approve adoption.
                  </p>

                <div className="space-y-4">
                  <label className="flex items-start bg-white p-4 rounded-xl border border-gray-150 cursor-pointer shadow-sm hover:border-brand-primary transition select-none">
                    <input 
                      type="checkbox" 
                      checked={checks.secureFencing} 
                      onChange={() => handleCheckChange('secureFencing')}
                      disabled={selectedApp.status !== 'Pending'}
                      className="form-checkbox h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded mt-0.5 mr-3 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800">Secure Fencing & Safe Gates</span>
                      <p className="text-xs text-gray-500 mt-1">Yard is securely fenced with no escape points or hazardous gaps.</p>
                    </div>
                  </label>

                  <label className="flex items-start bg-white p-4 rounded-xl border border-gray-150 cursor-pointer shadow-sm hover:border-brand-primary transition select-none">
                    <input 
                      type="checkbox" 
                      checked={checks.noHazards} 
                      onChange={() => handleCheckChange('noHazards')}
                      disabled={selectedApp.status !== 'Pending'}
                      className="form-checkbox h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded mt-0.5 mr-3 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800">No Balcony/Yard Hazards</span>
                      <p className="text-xs text-gray-500 mt-1">No toxic chemicals, open wiring, or unprotected high balconies.</p>
                    </div>
                  </label>

                  <label className="flex items-start bg-white p-4 rounded-xl border border-gray-150 cursor-pointer shadow-sm hover:border-brand-primary transition select-none">
                    <input 
                      type="checkbox" 
                      checked={checks.caretakerCommitted} 
                      onChange={() => handleCheckChange('caretakerCommitted')}
                      disabled={selectedApp.status !== 'Pending'}
                      className="form-checkbox h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded mt-0.5 mr-3 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800">Committed Caretaker & Funding</span>
                      <p className="text-xs text-gray-500 mt-1">An adult primary caretaker is designated and agrees to vaccination & vet costs.</p>
                    </div>
                  </label>

                  <label className="flex items-start bg-white p-4 rounded-xl border border-gray-150 cursor-pointer shadow-sm hover:border-brand-primary transition select-none">
                    <input 
                      type="checkbox" 
                      checked={checks.consentHomeChecks} 
                      onChange={() => handleCheckChange('consentHomeChecks')}
                      disabled={selectedApp.status !== 'Pending'}
                      className="form-checkbox h-5 w-5 text-brand-primary focus:ring-brand-primary border-gray-300 rounded mt-0.5 mr-3 cursor-pointer"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800">Home Inspection & Welfare Updates</span>
                      <p className="text-xs text-gray-500 mt-1">Adopter consents to home inspection and periodic photo/video updates.</p>
                    </div>
                  </label>
                </div>
              </div>
              ) : (
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-6 md:p-8 text-center">
                  <h4 className="text-base font-bold text-brand-primary mb-2">
                    Application Status: {selectedApp.status}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {selectedApp.status === 'Pending' && 'Your application is currently being reviewed by our volunteers. We will contact you soon.'}
                    {selectedApp.status === 'Approved' && 'Congratulations! Your application has been approved. The volunteer will contact you regarding the next steps.'}
                    {selectedApp.status === 'Rejected' && 'Unfortunately, your application was not approved at this time.'}
                  </p>
                </div>
              )}

              {/* Approve/Reject Buttons */}
              {user?.role !== 'user' && selectedApp.status === 'Pending' && (
                <div className="flex gap-4 pt-6 border-t flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleDecision('Rejected')}
                    disabled={updating}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 font-bold py-3.5 px-4 rounded-xl transition cursor-pointer text-center text-sm disabled:opacity-50"
                  >
                    Reject Application
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision('Approved')}
                    disabled={updating || !allChecksPassed}
                    className={`flex-1 font-bold py-3.5 px-4 rounded-xl shadow-lg transition transform text-sm text-center ${
                      allChecksPassed 
                        ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer hover:-translate-y-0.5' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed border'
                    }`}
                  >
                    {updating ? 'Updating...' : allChecksPassed ? 'Approve Adoption 🎉' : 'Approve Adoption (Safety Checks Pending)'}
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
              <span className="text-4xl inline-block mb-3 opacity-50">🐾</span>
              <p className="text-gray-500 text-sm font-bold">Select an applicant from the left to view vetting details.</p>
            </div>
          )}
        </div>

      </div>

      {/* Image Zoom Modal */}
      {zoomImage && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImage(null)}
        >
          <div className="max-w-4xl max-h-[90vh] relative">
            <img src={zoomImage} alt="Zoomed View" className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" />
            <button 
              onClick={() => setZoomImage(null)}
              className="absolute -top-10 right-0 text-white font-bold text-sm bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full cursor-pointer focus:outline-none"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReviewAdoptions;

