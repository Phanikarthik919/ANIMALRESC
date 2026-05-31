import { useContext, useState } from 'react';
import axios from 'axios';
import API_URL from '../config/api';
import defaultPetImg from '../assets/postPet.png';
import { AuthContext } from '../context/AuthContext';
import DonateModal from './DonateModal';

const RescueCard = ({ rescue, refreshRescues, setView, setSelectedRescue }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);

  const canClaim = user && (user.role === 'volunteer' || user.role === 'admin');

  const isClaimedByMe = user && rescue.claimedBy && 
    ((typeof rescue.claimedBy === 'string' && rescue.claimedBy === user.id) || 
     (typeof rescue.claimedBy === 'object' && (rescue.claimedBy._id === user.id || rescue.claimedBy.id === user.id)));

  const isReportedByMe = user && rescue.reportedBy && 
    ((typeof rescue.reportedBy === 'string' && rescue.reportedBy === user.id) || 
     (typeof rescue.reportedBy === 'object' && (rescue.reportedBy._id === user.id || rescue.reportedBy.id === user.id)));

  const isAdmin = user && user.role === 'admin';

  const handleClaim = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/rescues/${rescue._id}/claim`);
      if (refreshRescues) refreshRescues();
    } catch (error) {
      console.error('Error claiming rescue:', error);
      alert('Failed to claim rescue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/rescues/${rescue._id}/status`, { status: newStatus });
      if (refreshRescues) refreshRescues();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.response?.data?.message || 'Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'Rescued from Location':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'Rescued and Treated':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Ready for Adoption':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Rehomed':
        return 'bg-gray-100 text-gray-850 border border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out group flex flex-col">
      <div className="h-48 bg-slate-50 flex items-center justify-center relative overflow-hidden border-b border-gray-100">
        {rescue.photoUrl ? (
          <img src={rescue.photoUrl} alt="Rescue Animal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <img src={defaultPetImg} alt="Default Cartoon Animal" className="h-32 object-contain group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 drop-shadow-md" />
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight">{rescue.title}</h3>
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(rescue.status)}`}>
            {rescue.status}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{rescue.description}</p>
        
        <div className="flex flex-col text-sm text-gray-500 mb-4 gap-1.5">
          <div className="flex items-start">
            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="line-clamp-2">{rescue.location.address}</span>
          </div>
          {user && (user.role === 'volunteer' || user.role === 'admin') && (rescue.status === 'Pending' || rescue.status === 'Rescued from Location') && rescue.location && rescue.location.lat && rescue.location.lng && (
            <div className="mt-2 bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-blue-800">📍 Precise location pin active</span>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${rescue.location.lat},${rescue.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-full transition shadow-sm cursor-pointer"
              >
                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                Get Directions
              </a>
            </div>
          )}
        </div>
        
        {rescue.claimedBy && rescue.claimedBy.name && (
          <div className="mb-4 text-xs font-semibold text-brand-primary bg-indigo-50 border border-indigo-100 inline-block px-3 py-1 rounded-full">
            👤 Caring Volunteer: {rescue.claimedBy.name}
          </div>
        )}

        {rescue.needsDonation && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Donations</span>
              <span>${rescue.donationAmountRaised} / ${rescue.donationAmountNeeded}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${(rescue.donationAmountRaised / rescue.donationAmountNeeded) * 100}%` }}></div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {rescue.status === 'Pending' && canClaim && (
            <button 
              onClick={handleClaim}
              disabled={loading}
              className={`w-full bg-white border border-brand-primary text-brand-primary hover:bg-indigo-50 font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out cursor-pointer shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Claiming...' : 'Claim Rescue'}
            </button>
          )}

          {isClaimedByMe && rescue.status === 'Rescued from Location' && (
            <button 
              onClick={() => handleStatusUpdate('Rescued and Treated')}
              disabled={loading}
              className={`w-full bg-white border border-brand-primary text-brand-primary hover:bg-indigo-50 font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out cursor-pointer shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Updating...' : '🏥 Mark as Rescued & Treated'}
            </button>
          )}

          {isClaimedByMe && rescue.status === 'Rescued and Treated' && (
            <button 
              onClick={() => handleStatusUpdate('Ready for Adoption')}
              disabled={loading}
              className={`w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out cursor-pointer shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Updating...' : '🏡 Mark as Ready for Adoption'}
            </button>
          )}
          {rescue.status === 'Ready for Adoption' && (
            <>
              {isClaimedByMe ? (
                <button 
                  onClick={() => {
                    setSelectedRescue(rescue);
                    setView('review-adoptions');
                  }}
                  className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  📋 Review Applications
                </button>
              ) : isReportedByMe ? (
                <div className="w-full bg-amber-50 border border-amber-200 text-amber-700 font-semibold py-2 px-4 rounded-lg text-center text-sm">
                  ⚠️ You reported this rescue — you cannot adopt your own rescue.
                </div>
              ) : (
                <button 
                  onClick={() => {
                    if (!user) {
                      alert('Please sign in or sign up first to submit an adoption application.');
                    } else {
                      setSelectedRescue(rescue);
                      setView('apply-adoption');
                    }
                  }}
                  className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out cursor-pointer shadow-sm"
                >
                  🐾 Apply to Adopt
                </button>
              )}
            </>
          )}

          {isClaimedByMe && rescue.status === 'Ready for Adoption' && (
            <button 
              onClick={() => handleStatusUpdate('Rehomed')}
              disabled={loading}
              className={`w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out cursor-pointer shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Updating...' : '🎉 Mark as Rehomed (Manual)'}
            </button>
          )}

        {rescue.needsDonation && rescue.status !== 'Rehomed' && (
            <button 
              onClick={() => setShowDonateModal(true)}
              className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold py-2 px-4 rounded-lg transition duration-150 ease-in-out cursor-pointer shadow-sm"
            >
              💚 Donate to Help
            </button>
          )}
        </div>
      </div>

      {/* Donate Modal */}
      {showDonateModal && (
        <DonateModal 
          rescue={rescue} 
          onClose={() => setShowDonateModal(false)} 
          onDonated={refreshRescues} 
        />
      )}
    </div>
  );
};

export default RescueCard;
