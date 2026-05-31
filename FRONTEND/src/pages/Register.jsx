import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import bgImage from '../assets/adoptPet.png';
import animalSvg from '../assets/animal.svg';

const Register = ({ setView }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(formData);
    if (res.success) {
      setView('list');
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
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row-reverse m-4 md:m-8 animate-fadeInUp my-auto">
        
        {/* Right Side (Form, since row-reverse) */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative bg-white">
          <button 
            onClick={() => setView('list')} 
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            title="Back to Home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <div>
            <h2 className="mt-2 text-3xl font-extrabold text-brand-darkGrey">
              Join the Network 🐾
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Create an account to report rescues or find your new best friend.
            </p>
          </div>
          
          {error && <div className="mt-4 bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium border border-red-100">{error}</div>}
          
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input name="name" type="text" required className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary sm:text-sm transition-all bg-gray-50 focus:bg-white" placeholder="John Doe" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                <input name="email" type="email" required className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary sm:text-sm transition-all bg-gray-50 focus:bg-white" placeholder="john@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input name="password" type="password" required className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary sm:text-sm transition-all bg-gray-50 focus:bg-white" placeholder="Min. 6 characters" minLength="6" value={formData.password} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I want to register as a:</label>
                <select name="role" value={formData.role} onChange={handleChange} className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary sm:text-sm transition-all bg-gray-50 focus:bg-white cursor-pointer">
                  <option value="user">Adopter / General Public</option>
                  <option value="volunteer">Volunteer / Rescue Worker</option>
                </select>
              </div>
            </div>
            
            <div className="pt-2">
              <button type="submit" className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-primary hover:bg-brand-primaryDark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
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
              <GoogleLoginButton setView={setView} role={formData.role} />
            </div>
            
            <div className="text-center text-sm text-gray-600 mt-2">
              Already have an account?{' '}
              <button type="button" onClick={() => setView('login')} className="font-bold text-brand-primary hover:text-brand-primaryDark transition-colors">
                Sign in
              </button>
            </div>
          </form>
        </div>
        
        {/* Left Side (Visual, since row-reverse) */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-indigo-50 to-brand-primaryLight/30 items-center justify-center relative p-12">
          <img src={animalSvg} alt="Animals" className="w-full max-w-sm relative z-10 drop-shadow-xl" />
        </div>
      </div>
    </div>
  );
};

export default Register;
