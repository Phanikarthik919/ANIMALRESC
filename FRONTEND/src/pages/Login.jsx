import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import bgImage from '../assets/adoptPet.png';
import cuteDoggie from '../assets/Cute Doggie.gif';
import {
  formCard,
  formTitle,
  labelClass,
  inputClass,
  submitBtnDark,
  formSidePanel,
  errorClass,
  linkClass,
} from '../styles/common';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(formData);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900">
      {/* Blurred background image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 blur-sm scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Main Split-Pane Card */}
      <div className={formCard}>
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative bg-white">
          <button 
            onClick={() => navigate('/')} 
            className="mb-8 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
            title="Back to Home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          
          <div>
            <h2 className={formTitle}>
              Welcome Back <span className="inline-block animate-wave">👋</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue making a difference in animals' lives.
            </p>
          </div>
          
          {error && <div className={errorClass}>{error}</div>}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Email</label>
                <input name="email" type="email" required className={inputClass} placeholder="Example@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input name="password" type="password" required className={inputClass} placeholder="At least 6 characters" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
            </div>
            
            <div>
              <button type="submit" className={submitBtnDark}>
                Sign In
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 font-medium">Or</span>
              </div>
            </div>
            
            <GoogleLoginButton />
            
            <div className="text-center text-sm text-gray-600 mt-2">
              Don't have an account?{' '}
              <button type="button" onClick={() => navigate('/register')} className={linkClass}>
                Sign up
              </button>
            </div>
          </form>
        </div>
        
        {/* Right Side: Image/Animation */}
        <div className={formSidePanel}>
          <img src={cuteDoggie} alt="Cute dog animation" className="w-full max-w-sm relative z-10 drop-shadow-2xl mix-blend-multiply" />
        </div>
      </div>
    </div>
  );
};

export default Login;
