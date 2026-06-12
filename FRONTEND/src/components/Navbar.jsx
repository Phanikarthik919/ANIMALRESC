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
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {showSOS && (
        <div className={sosBarClass}>
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
      <nav className={navbarClass}>
        <div className={navContainerClass}>
          <div className={navInnerClass}>
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
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
                onClick={() => navigate('/')} 
                className={navLinkClass(location.pathname === '/')}
              >
                Dashboard
              </button>
              <button 
                onClick={() => navigate('/campaigns')} 
                className={navLinkClass(location.pathname === '/campaigns')}
              >
                Campaigns
              </button>
              <button 
                onClick={() => navigate('/blogs')} 
                className={navLinkClass(location.pathname === '/blogs')}
              >
                Blogs
              </button>
              {user && (
                <button 
                  onClick={() => {
                    if (setSelectedRescue) setSelectedRescue(null);
                    navigate('/review-adoptions');
                  }} 
                  className={navLinkClass(location.pathname === '/review-adoptions')}
                >
                  {user.role === 'user' ? 'My Applications' : 'Review Applications'}
                </button>
              )}
              <button 
                onClick={() => navigate('/new')} 
                className={navCtaBtn}
              >
                Report Rescue
              </button>
              
              {/* Auth Section */}
              <div className="border-l border-gray-200 pl-6 flex items-center">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => navigate('/profile')}
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
                      onClick={() => { logout(); navigate('/'); }} 
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                      title="Logout"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => navigate('/login')} 
                      className="text-gray-600 hover:text-brand-primary font-bold text-sm transition-colors cursor-pointer"
                    >
                      Log in
                    </button>
                    <button 
                      onClick={() => navigate('/register')} 
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
