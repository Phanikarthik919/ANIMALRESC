import React, { useState, useContext } from 'react';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';

import defaultAvatar from '../assets/cute monkey animal.svg';

const Navbar = ({ view, setView, setSelectedRescue }) => {
  const [showSOS, setShowSOS] = useState(true);
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {showSOS && (
        <div className="bg-red-600 text-white py-2 px-4 font-bold text-sm tracking-wide shadow-inner flex justify-between items-center relative z-50">
          <div className="flex-1 text-center flex justify-center items-center">
            <span className="mr-2 animate-pulse">🚨 EMERGENCY SOS: See an animal in immediate danger?</span> 
            <a href="tel:+919920737737" className="underline hover:text-red-200 transition">Call +91 9920 737 737 Now</a>
          </div>
          <button 
            onClick={() => setShowSOS(false)} 
            className="text-white hover:text-red-200 focus:outline-none absolute right-4 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}
      <nav className="bg-white shadow-sm sticky top-0 z-40 glassmorphism border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('list')}>
              {/* Logo Image */}
              <div className="relative w-12 h-12 flex items-center justify-center bg-brand-primaryLight/30 rounded-xl group-hover:bg-brand-primaryLight/50 transition-colors">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-8 w-auto group-hover:scale-110 transition-transform duration-500 drop-shadow-sm relative z-10" 
                />
              </div>
              
              {/* Stylized Text */}
              <div className="flex flex-col justify-center">
                <span className="text-xl font-extrabold tracking-tight text-brand-darkGrey leading-none">
                  Animal <span className="text-brand-primary">Rescue</span>
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                  Network
                </span>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-6">
              <button 
                onClick={() => setView('list')} 
                className={`px-3 py-2 rounded-md text-sm font-bold transition-all ${view === 'list' ? 'text-brand-primary bg-orange-50' : 'text-gray-500 hover:text-brand-primary hover:bg-orange-50'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setView('campaigns')} 
                className={`px-3 py-2 rounded-md text-sm font-bold transition-all ${view === 'campaigns' ? 'text-brand-primary bg-orange-50' : 'text-gray-500 hover:text-brand-primary hover:bg-orange-50'}`}
              >
                Campaigns
              </button>
              <button 
                onClick={() => setView('blogs')} 
                className={`px-3 py-2 rounded-md text-sm font-bold transition-all ${view === 'blogs' ? 'text-brand-primary bg-orange-50' : 'text-gray-500 hover:text-brand-primary hover:bg-orange-50'}`}
              >
                Blogs
              </button>
              {user && (
                <button 
                  onClick={() => {
                    if (setSelectedRescue) setSelectedRescue(null);
                    setView('review-adoptions');
                  }} 
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-all ${view === 'review-adoptions' ? 'text-brand-primary bg-indigo-50' : 'text-gray-500 hover:text-brand-primary hover:bg-indigo-50'}`}
                >
                  {user.role === 'user' ? 'My Applications' : 'Review Applications'}
                </button>
              )}
              <button 
                onClick={() => setView('new')} 
                className={`ml-4 px-5 py-2.5 rounded-full text-sm font-bold transition-all transform hover:-translate-y-0.5 shadow-sm ${view === 'new' ? 'bg-brand-primaryDark text-white shadow-md' : 'bg-brand-primary text-white hover:shadow-md'}`}
              >
                Report Rescue
              </button>
              
              {/* Auth Section */}
              <div className="border-l border-gray-200 pl-6 flex items-center">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => setView('profile')}
                      className="flex items-center gap-3 bg-gray-50 px-2 py-1.5 rounded-full border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-100 hover:border-brand-primary/30 transition-all"
                      title="View Profile"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-primaryLight/50 text-white flex items-center justify-center font-bold text-sm shadow-inner overflow-hidden p-1">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <img src={defaultAvatar} alt="Default Avatar" className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div className="text-left flex flex-col justify-center pr-3">
                        <span className="text-sm font-bold text-gray-900 leading-none whitespace-nowrap">{user.name ? user.name.split(' ')[0] : 'User'}</span>
                        <span className="text-[10px] font-bold text-brand-primary capitalize mt-1 tracking-wide">{user.role}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => { logout(); setView('list'); }} 
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                      title="Logout"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => setView('login')} 
                      className="text-gray-600 hover:text-brand-primary text-sm font-bold transition-colors"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setView('register')} 
                      className="border border-gray-300 text-gray-600 hover:border-brand-primary hover:text-brand-primary px-4 py-2 rounded-full text-sm font-bold transition-all"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
