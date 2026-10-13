import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import defaultAvatar from '../assets/cute monkey animal.svg';
import {
  navbarClass,
  navContainerClass,
  navInnerClass,
  navLinkClass,
  navCtaBtn,
  sosBarClass,
} from '../styles/common';

const Navbar = ({ setSelectedRescue }) => {
  const [showSOS, setShowSOS] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      {showSOS && (
        <div className={sosBarClass}>
          <div className="flex-1 text-center flex justify-center items-center text-xs sm:text-sm">
            <span className="mr-2 animate-pulse">🚨 EMERGENCY SOS: See an animal in danger?</span> 
            <a href="tel:+919920737737" className="underline hover:text-red-200 transition font-bold">Call +91 9920 737 737</a>
          </div>
          <button 
            onClick={() => setShowSOS(false)} 
            className="text-white hover:text-red-200 focus:outline-none absolute right-3 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
      )}
      <nav className={navbarClass}>
        <div className={navContainerClass}>
          <div className={navInnerClass}>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNavClick('/')}>
              {/* Logo Image */}
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-brand-primaryLight/30 rounded-xl group-hover:bg-brand-primaryLight/50 transition-colors">
                <img 
                  src={logo} 
                  alt="Logo" 
                  className="h-7 sm:h-8 w-auto group-hover:scale-110 transition-transform duration-500 drop-shadow-sm relative z-10" 
                />
              </div>
              
              {/* Stylized Text */}
              <div className="flex flex-col justify-center">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-brand-darkGrey leading-none">
                  Animal <span className="text-brand-primary">Rescue</span>
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                  Network
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex md:items-center space-x-4 lg:space-x-6">
              <button 
                onClick={() => handleNavClick('/')} 
                className={navLinkClass(location.pathname === '/')}
              >
                Dashboard
              </button>
              <button 
                onClick={() => handleNavClick('/campaigns')} 
                className={navLinkClass(location.pathname === '/campaigns')}
              >
                Campaigns
              </button>
              <button 
                onClick={() => handleNavClick('/blogs')} 
                className={navLinkClass(location.pathname === '/blogs')}
              >
                Blogs
              </button>
              {user && (
                <button 
                  onClick={() => {
                    if (setSelectedRescue) setSelectedRescue(null);
                    handleNavClick('/review-adoptions');
                  }} 
                  className={navLinkClass(location.pathname === '/review-adoptions')}
                >
                  {user.role === 'user' ? 'My Applications' : 'Review Applications'}
                </button>
              )}
              <button 
                onClick={() => handleNavClick('/new')} 
                className={navCtaBtn}
              >
                Report Rescue
              </button>
              
              {/* Auth Section */}
              <div className="border-l border-gray-200 pl-4 lg:pl-6 flex items-center">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => handleNavClick('/profile')}
                      className="flex items-center gap-2 bg-gray-50 px-2 py-1.5 rounded-full border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-100 hover:border-brand-primary/30 transition-all"
                      title="View Profile"
                    >
                      <div className="w-8 h-8 rounded-full bg-brand-primaryLight/50 text-white flex items-center justify-center font-bold text-sm shadow-inner overflow-hidden p-1">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <img src={defaultAvatar} alt="Default Avatar" className="w-full h-full object-contain" />
                        )}
                      </div>
                      <div className="text-left flex flex-col justify-center pr-2">
                        <span className="text-sm font-bold text-gray-900 leading-none whitespace-nowrap">{user.name ? user.name.split(' ')[0] : 'User'}</span>
                        <span className="text-[10px] font-bold text-brand-primary capitalize mt-1 tracking-wide">{user.role}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => { logout(); handleNavClick('/'); }} 
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all cursor-pointer"
                      title="Logout"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 lg:space-x-3">
                    <button 
                      onClick={() => handleNavClick('/login')} 
                      className="text-gray-600 hover:text-brand-primary font-bold text-sm transition-colors cursor-pointer px-3 py-1.5"
                    >
                      Log in
                    </button>
                    <button 
                      onClick={() => handleNavClick('/register')} 
                      className="border border-gray-300 text-gray-600 hover:border-brand-primary hover:text-brand-primary px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => handleNavClick('/new')}
                className="bg-brand-primary text-white text-xs font-bold px-3 py-2 rounded-full shadow-sm"
              >
                Report
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-brand-primary p-2 rounded-lg hover:bg-gray-100 focus:outline-none transition-colors cursor-pointer"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2">
            <button 
              onClick={() => handleNavClick('/')} 
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-between ${
                location.pathname === '/' ? 'bg-orange-50 text-brand-primary' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>🏠 Dashboard</span>
              <span className="text-xs text-gray-400">→</span>
            </button>
            <button 
              onClick={() => handleNavClick('/campaigns')} 
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-between ${
                location.pathname === '/campaigns' ? 'bg-orange-50 text-brand-primary' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>📢 Campaigns</span>
              <span className="text-xs text-gray-400">→</span>
            </button>
            <button 
              onClick={() => handleNavClick('/blogs')} 
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-between ${
                location.pathname === '/blogs' ? 'bg-orange-50 text-brand-primary' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>📝 Blogs</span>
              <span className="text-xs text-gray-400">→</span>
            </button>
            {user && (
              <button 
                onClick={() => {
                  if (setSelectedRescue) setSelectedRescue(null);
                  handleNavClick('/review-adoptions');
                }} 
                className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-between ${
                  location.pathname === '/review-adoptions' ? 'bg-orange-50 text-brand-primary' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>🐾 {user.role === 'user' ? 'My Applications' : 'Review Applications'}</span>
                <span className="text-xs text-gray-400">→</span>
              </button>
            )}

            <button 
              onClick={() => handleNavClick('/new')} 
              className="w-full text-center bg-brand-primary text-white py-3 px-4 rounded-xl font-bold text-sm shadow-md mt-2"
            >
              🚨 Report Rescue (AI Triage)
            </button>

            {/* Mobile Auth Section */}
            <div className="pt-3 border-t border-gray-100">
              {user ? (
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl">
                  <div 
                    onClick={() => handleNavClick('/profile')}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-primaryLight/40 p-1">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <img src={defaultAvatar} alt="Default Avatar" className="w-full h-full object-contain" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{user.name || 'User'}</div>
                      <div className="text-xs text-brand-primary font-medium capitalize">{user.role} • View Profile</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { logout(); handleNavClick('/'); }} 
                    className="text-gray-400 hover:text-red-500 p-2 rounded-full cursor-pointer"
                    title="Logout"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleNavClick('/login')} 
                    className="w-full text-center border border-gray-300 py-2.5 rounded-xl font-bold text-sm text-gray-700 hover:border-brand-primary"
                  >
                    Log in
                  </button>
                  <button 
                    onClick={() => handleNavClick('/register')} 
                    className="w-full text-center bg-gray-900 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-black"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
