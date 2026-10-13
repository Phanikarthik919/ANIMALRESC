import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import defaultPetImg from '../assets/postPet.png';
import { AuthContext } from '../context/AuthContext';
import DonateModal from './DonateModal';
import {
  cardClass,
  badgeBase,
  badgePending,
  badgeRescued,
  badgeTreated,
  badgeAdoption,
  badgeRehomed,
  volunteerBadge,
  warningBadge,
  outlineBtn,
  primaryBtnFull,
  dangerBtn,
  donateBtn,
} from '../styles/common';

const RescueCard = ({ rescue, refreshRescues, setSelectedRescue }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const navigate = useNavigate();

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
      case 'Pending':               return badgePending;
      case 'Rescued from Location': return badgeRescued;
      case 'Rescued and Treated':   return badgeTreated;
      case 'Ready for Adoption':    return badgeAdoption;
      case 'Rehomed':               return badgeRehomed;
      default:                      return badgeRehomed;
    }
  };

  return (
    <div className={cardClass + " group flex flex-col relative"}>
      <div className="h-48 bg-slate-50 flex items-center justify-center relative overflow-hidden border-b border-gray-100">
        {/* AI Triage Priority Overlay */}
        {rescue.aiTriage && rescue.aiTriage.severity && rescue.aiTriage.severity !== 'None' && (
          <div className="absolute top-3 left-3 z-10 shadow-lg">
            <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow ${
              rescue.aiTriage.severity === 'Critical' 
                ? 'bg-red-600 text-white animate-pulse' 
                : rescue.aiTriage.severity === 'High' 
                ? 'bg-orange-600 text-white' 
                : rescue.aiTriage.severity === 'Medium' 
                ? 'bg-amber-500 text-white' 
                : 'bg-emerald-600 text-white'
            }`}>
              <span>{rescue.aiTriage.severity === 'Critical' ? '🚨' : rescue.aiTriage.severity === 'High' ? '⚠️' : '🩺'}</span>
              <span>Priority: {rescue.aiTriage.triageScore || 50}/100</span>
            </span>
          </div>
        )}

        {rescue.photoUrl ? (
          <img src={rescue.photoUrl} alt="Rescue Animal" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <img src={defaultPetImg} alt="Default Cartoon Animal" className="h-32 object-contain group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 drop-shadow-md" />
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight">{rescue.title}</h3>
          <span className={`${badgeBase} ${getStatusBadgeClass(rescue.status)}`}>
            {rescue.status}
          </span>
        </div>

        {/* AI Triage Quick Link */}
        {rescue.aiTriage && rescue.aiTriage.injuryType && (
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium truncate max-w-[65%]">
              🧬 {rescue.aiTriage.species} • {rescue.aiTriage.injuryType}
            </span>
            <button
              type="button"
              onClick={() => setShowTriageModal(true)}
              className="text-xs font-bold text-brand-primary hover:text-brand-primaryDark hover:underline cursor-pointer"
            >
              🩺 AI Report
            </button>
          </div>
        )}

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
          <div className={volunteerBadge}>
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
              className={`${outlineBtn} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Claiming...' : 'Claim Rescue'}
            </button>
          )}

          {isClaimedByMe && rescue.status === 'Rescued from Location' && (
            <button 
              onClick={() => handleStatusUpdate('Rescued and Treated')}
              disabled={loading}
              className={`${outlineBtn} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Updating...' : '🏥 Mark as Rescued & Treated'}
            </button>
          )}

          {isClaimedByMe && rescue.status === 'Rescued and Treated' && (
            <button 
              onClick={() => handleStatusUpdate('Ready for Adoption')}
              disabled={loading}
              className={`${primaryBtnFull} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Updating...' : '🏡 Mark as Ready for Adoption'}
            </button>
          )}
          {rescue.status === 'Ready for Adoption' && (
            <>
              {isClaimedByMe ? (
                <button 
                  onClick={() => {
                    if (setSelectedRescue) {
                      setSelectedRescue(rescue);
                      navigate('/review-adoptions');
                    }
                  }}
                  className={primaryBtnFull + " flex items-center justify-center gap-2"}
                >
                  📋 Review Applications
                </button>
              ) : isReportedByMe ? (
                <div className={warningBadge}>
                  ⚠️ You reported this rescue — you cannot adopt your own rescue.
                </div>
              ) : (
                <button 
                  onClick={() => {
                    if (!user) {
                      alert('Please sign in or sign up first to submit an adoption application.');
                    } else if (setSelectedRescue) {
                      setSelectedRescue(rescue);
                      navigate('/apply-adoption');
                    }
                  }}
                  className={primaryBtnFull}
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
              className={`${dangerBtn} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Updating...' : '🎉 Mark as Rehomed (Manual)'}
            </button>
          )}

        {rescue.needsDonation && rescue.status !== 'Rehomed' && (
            <button 
              onClick={() => setShowDonateModal(true)}
              className={donateBtn}
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

      {/* AI Triage Report Modal */}
      {showTriageModal && rescue.aiTriage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowTriageModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-5 border-b pb-4">
              <span className="text-3xl">🩺</span>
              <div>
                <h3 className="text-xl font-black text-gray-900">AI Veterinary Triage Assessment</h3>
                <p className="text-xs text-gray-500">Autonomous multimodal clinical evaluation</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Emergency Severity Header */}
              <div className="flex items-center justify-between p-4 bg-orange-50/80 rounded-2xl border border-orange-200">
                <div>
                  <span className="text-xs text-orange-800 font-bold uppercase tracking-wider block">Priority Score</span>
                  <span className="text-2xl font-black text-brand-primary">{rescue.aiTriage.triageScore || 50}/100</span>
                </div>
                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
                  rescue.aiTriage.severity === 'Critical' ? 'bg-red-600 text-white animate-pulse' :
                  rescue.aiTriage.severity === 'High' ? 'bg-orange-600 text-white' :
                  rescue.aiTriage.severity === 'Medium' ? 'bg-amber-500 text-white' :
                  'bg-emerald-600 text-white'
                }`}>
                  {rescue.aiTriage.severity} Severity
                </span>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 font-medium block">Species & Breed</span>
                  <span className="font-bold text-gray-800 text-sm">{rescue.aiTriage.species}</span>
                  {rescue.aiTriage.breedEstimation && (
                    <span className="text-gray-500 block">{rescue.aiTriage.breedEstimation}</span>
                  )}
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 font-medium block">Urgency Window</span>
                  <span className="font-bold text-gray-800 text-sm">{rescue.aiTriage.urgencyWindow || 'Standard (< 6h)'}</span>
                </div>
              </div>

              {/* Trauma Observation */}
              {rescue.aiTriage.injuryType && (
                <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                  <span className="text-gray-400 font-bold block mb-1">🩹 Suspected Injury / Trauma:</span>
                  <p className="text-gray-800 font-medium">{rescue.aiTriage.injuryType}</p>
                </div>
              )}

              {/* Clinical Notes */}
              {rescue.aiTriage.clinicalNotes && (
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950">
                  <span className="font-bold block mb-1">🔍 Diagnostic Observations:</span>
                  <p className="leading-relaxed">{rescue.aiTriage.clinicalNotes}</p>
                </div>
              )}

              {/* First-Aid for Rescuers & Volunteers */}
              {rescue.aiTriage.suggestedFirstAid && rescue.aiTriage.suggestedFirstAid !== 'N/A' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
                  <span className="font-bold block mb-1.5 flex items-center gap-1.5 text-sm">
                    <span>🩹</span> Rescuer Protocol & First-Aid:
                  </span>
                  <p className="leading-relaxed whitespace-pre-line">{rescue.aiTriage.suggestedFirstAid}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <button
                type="button"
                onClick={() => setShowTriageModal(false)}
                className="bg-gray-900 hover:bg-black text-white font-bold text-xs py-2.5 px-6 rounded-full cursor-pointer transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescueCard;
