import React, { useState, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import Hero from '../components/Hero';
import RescueCard from '../components/RescueCard';
import ServicesSection from '../components/ServicesSection';
import footprint from '../assets/footPrint.png';
import doggie from '../assets/sad_dog.png';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { rescues, fetchRescues, setSelectedRescue } = useOutletContext();
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('All');
  const [showOnlyMyClaims, setShowOnlyMyClaims] = useState(false);
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'recent'
  const [severityFilter, setSeverityFilter] = useState('All'); // 'All' | 'Critical' | 'High' | 'Medium' | 'Low'
  
  const activeRescues = rescues.filter(r => r.status !== 'Rehomed');
  const rehomedRescues = rescues.filter(r => r.status === 'Rehomed');

  const tabs = ['All', 'Pending', 'Rescued from Location', 'Rescued and Treated', 'Ready for Adoption'];
  
  // Filter and sort active rescues
  const filteredRescues = activeRescues
    .filter(rescue => {
      const matchesTab = activeTab === 'All' || rescue.status === activeTab;
      
      if (!matchesTab) return false;

      if (showOnlyMyClaims) {
        const currentUserId = user ? (user.id || user._id) : null;
        const isClaimedByMe = currentUserId && rescue.claimedBy && 
          ((typeof rescue.claimedBy === 'string' && rescue.claimedBy === currentUserId) || 
           (typeof rescue.claimedBy === 'object' && (rescue.claimedBy._id === currentUserId || rescue.claimedBy.id === currentUserId)));
        if (!isClaimedByMe) return false;
      }

      if (severityFilter !== 'All') {
        const sev = rescue.aiTriage?.severity || 'Medium';
        if (sev !== severityFilter) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const scoreA = a.aiTriage?.triageScore ?? (a.aiTriage?.severity === 'Critical' ? 95 : a.aiTriage?.severity === 'High' ? 75 : 40);
        const scoreB = b.aiTriage?.triageScore ?? (b.aiTriage?.severity === 'Critical' ? 95 : b.aiTriage?.severity === 'High' ? 75 : 40);
        if (scoreB !== scoreA) return scoreB - scoreA;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // Count critical/high cases needing help
  const criticalCount = activeRescues.filter(r => r.status === 'Pending' && (r.aiTriage?.severity === 'Critical' || r.aiTriage?.severity === 'High')).length;

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Hero Section */}
      <Hero />

      {/* Emergency Alert Banner if critical stray rescues exist */}
      {criticalCount > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 rounded-2xl text-white shadow-lg flex items-center justify-between flex-wrap gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider">
                {criticalCount} Critical Emergency Case{criticalCount > 1 ? 's' : ''} Awaiting Rescue
              </h4>
              <p className="text-xs text-white/90">
                AI Triage has flagged life-threatening injuries requiring urgent volunteer dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveTab('Pending');
              setSeverityFilter('Critical');
              setSortBy('priority');
            }}
            className="bg-white text-red-700 font-extrabold text-xs px-4 py-2 rounded-full shadow hover:bg-orange-50 transition cursor-pointer"
          >
            View Critical Cases →
          </button>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center flex-wrap gap-4">
          <div className="flex items-center">
            <img src={footprint} alt="paw" className="h-8 w-8 mr-3 opacity-40 rotate-12" />
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Active Rescues</h2>
          </div>
          {user && (user.role === 'volunteer' || user.role === 'admin') && (
            <label className="inline-flex items-center bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm font-bold text-gray-700 cursor-pointer hover:bg-orange-50 hover:border-brand-primary transition-all select-none">
              <input 
                type="checkbox" 
                checked={showOnlyMyClaims} 
                onChange={(e) => setShowOnlyMyClaims(e.target.checked)}
                className="form-checkbox h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded mr-2 cursor-pointer"
              />
              🎯 Show My Claims Only
            </label>
          )}
        </div>
        
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto space-x-2 pb-2 md:pb-0 hide-scrollbar max-w-full">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${
                activeTab === tab 
                  ? 'bg-brand-primary text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-orange-50 hover:text-brand-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* AI Triage Sorting & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-50 p-3 sm:p-4 rounded-2xl border border-gray-200/70 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-700 flex items-center gap-1">
            <span>🔬 AI Triage Filter:</span>
          </span>
          {['All', 'Critical', 'High', 'Medium', 'Low'].map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-full font-bold transition cursor-pointer ${
                severityFilter === sev
                  ? (sev === 'Critical' ? 'bg-red-600 text-white shadow-sm' :
                     sev === 'High' ? 'bg-orange-600 text-white shadow-sm' :
                     sev === 'Medium' ? 'bg-amber-500 text-white shadow-sm' :
                     sev === 'Low' ? 'bg-emerald-600 text-white shadow-sm' :
                     'bg-gray-900 text-white shadow-sm')
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {sev === 'Critical' ? '🚨 Critical' :
               sev === 'High' ? '⚠️ High' :
               sev === 'Medium' ? '🩺 Medium' :
               sev === 'Low' ? '🟢 Low' : 'All'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-700">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-gray-300 font-semibold text-gray-800 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer text-xs"
          >
            <option value="priority">🚨 AI Emergency Priority (Highest First)</option>
            <option value="recent">🕒 Most Recent First</option>
          </select>
        </div>
      </div>
      
      {filteredRescues.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <img src={doggie} alt="Cute dog playing" className="h-48 mb-6 drop-shadow-md rounded-2xl" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No rescues found here!</h3>
          <p className="text-gray-500 text-lg max-w-sm">It looks like the "{activeTab}" tab is currently empty. Check back later or report a new rescue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRescues.map(rescue => (
            <RescueCard key={rescue._id} rescue={rescue} refreshRescues={fetchRescues} setSelectedRescue={setSelectedRescue} />
          ))}
        </div>
      )}

      {/* Rehomed Section (Success Stories) */}
      {rehomedRescues.length > 0 && (
        <div className="mt-24 border-t border-gray-200/80 pt-16">
          <div className="flex items-center justify-center mb-10">
            <span className="text-3xl mr-3 animate-pulse">🎉</span>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center">Happy Beginnings (Rehomed)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rehomedRescues.map(rescue => (
              <RescueCard key={rescue._id} rescue={rescue} refreshRescues={fetchRescues} setSelectedRescue={setSelectedRescue} />
            ))}
          </div>
        </div>
      )}

      {/* Services Section */}
      <ServicesSection setActiveTab={setActiveTab} />
    </div>
  );
};

export default Dashboard;
