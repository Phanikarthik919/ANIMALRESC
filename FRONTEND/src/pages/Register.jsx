import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import bgImage from '../assets/adoptPet.png';
import animalSvg from '../assets/animal.svg';
import {
  formCard,
  formTitle,
  labelClass,
  inputClass,
  selectClass,
  submitBtn,
  formSidePanel,
  errorClass,
  linkClass,
} from '../styles/common';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(formData);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900">
      {/* Blurred background image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 blur-sm scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Main Split-Pane Card */}
      <div className={formCard + " md:flex-row-reverse my-auto"}>
        
        {/* Right Side (Form, since row-reverse) */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative bg-white">
          <button 
            onClick={() => navigate('/')} 
            className="mb-8 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
            title="Back to Home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <div>
            <h2 className={formTitle}>
              Join the Network 🐾
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Create an account to report rescues or find your new best friend.
            </p>
          </div>
          
          {error && <div className={errorClass}>{error}</div>}
          
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input name="name" type="text" required className={inputClass} placeholder="John Doe" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Email address</label>
                <input name="email" type="email" required className={inputClass} placeholder="john@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input name="password" type="password" required className={inputClass} placeholder="Min. 6 characters" minLength="6" value={formData.password} onChange={handleChange} />
              </div>
              <div>
                <label className={labelClass}>I want to register as a:</label>
                <select name="role" value={formData.role} onChange={handleChange} className={selectClass}>
                  <option value="user">Adopter / General Public</option>
                  <option value="volunteer">Volunteer / Rescue Worker</option>
                </select>
              </div>
            </div>
            
            <div className="pt-2">
              <button type="submit" className={submitBtn}>
                Create Account
              </button>
            </div>
            
            <div className="relative pt-2">
              <div className="absolute inset-0 flex items-center pt-2">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm mt-2">
                <span className="px-4 bg-white text-gray-400 font-medium">Or</span>
              </div>
            </div>
            
            <div className="-mt-2">
              <GoogleLoginButton role={formData.role} />
            </div>
            
            <div className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{' '}
              <button type="button" onClick={() => navigate('/login')} className={linkClass}>
                Sign in
              </button>
            </div>
          </form>
        </div>
        
        {/* Left Side (Visual, since row-reverse) */}
        <div className={formSidePanel}>
          <img src={animalSvg} alt="Animals" className="w-full max-w-sm relative z-10 drop-shadow-xl" />
        </div>
      </div>
    </div>
  );
};

export default Register;
