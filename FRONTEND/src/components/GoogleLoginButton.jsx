import React, { useEffect, useContext, useRef, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const GoogleLoginButton = ({ setView, role = null }) => {
  const { googleLogin, updateRole } = useContext(AuthContext);
  const buttonRef = useRef(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  useEffect(() => {
    // Check if Google object is available
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
        callback: async (response) => {
          const res = await googleLogin(response.credential, role);
          if (res.success) {
            if (res.isNewUser) {
              // If it's a new user, show the role selection popup
              setShowRoleModal(true);
            } else if (setView) {
              // Existing user, proceed immediately
              setView('list');
            }
          }
        }
      });

      window.google.accounts.id.renderButton(
        buttonRef.current,
        { theme: 'outline', size: 'large', width: '100%' } // Customize as needed
      );
    }
  }, [googleLogin, setView, role]);

  const handleRoleSelection = async (selectedRole) => {
    setIsUpdatingRole(true);
    const res = await updateRole(selectedRole);
    if (res.success && setView) {
      setShowRoleModal(false);
      setView('list');
    }
    setIsUpdatingRole(false);
  };

  return (
    <>
      <div className="w-full flex justify-center my-4">
        <div ref={buttonRef}></div>
      </div>

      {showRoleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fadeInUp text-center">
            <div className="w-16 h-16 bg-brand-primaryLight text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-extrabold text-brand-darkGrey mb-2">Welcome to the Network!</h3>
            <p className="text-gray-500 mb-8 text-sm">To complete your profile, please tell us how you'll be using the platform.</p>
            
            <div className="space-y-4">
              <button 
                onClick={() => handleRoleSelection('user')}
                disabled={isUpdatingRole}
                className="w-full bg-white border-2 border-gray-200 hover:border-brand-primary hover:bg-brand-primaryLight/30 text-brand-darkGrey font-bold py-4 px-4 rounded-xl transition-all flex flex-col items-center justify-center gap-1 group disabled:opacity-50"
              >
                <span className="text-lg group-hover:text-brand-primary transition-colors">Public / Adopter</span>
                <span className="text-xs text-gray-400 font-medium">I want to report rescues and adopt pets</span>
              </button>
              
              <button 
                onClick={() => handleRoleSelection('volunteer')}
                disabled={isUpdatingRole}
                className="w-full bg-white border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 text-brand-darkGrey font-bold py-4 px-4 rounded-xl transition-all flex flex-col items-center justify-center gap-1 group disabled:opacity-50"
              >
                <span className="text-lg group-hover:text-indigo-600 transition-colors">Volunteer</span>
                <span className="text-xs text-gray-400 font-medium">I am a verified rescuer or shelter worker</span>
              </button>
            </div>
            
            {isUpdatingRole && (
              <p className="text-brand-primary text-xs font-bold mt-4 animate-pulse">Setting up your profile...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GoogleLoginButton;
