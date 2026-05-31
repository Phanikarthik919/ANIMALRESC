import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import bgImage from '../assets/happy_dog.png';
import cuteDoggie from '../assets/Cute Doggie.gif';

const Login = ({ setView }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(formData);
    if (res.success) {
      setView('list');
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
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row m-4 md:m-8 animate-fadeInUp">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative bg-white">
          <button 
            onClick={() => setView('list')} 
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 transition-colors"
            title="Back to Home"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          
          <div>
            <h2 className="mt-2 text-3xl font-extrabold text-brand-darkGrey">
              Welcome Back <span className="inline-block animate-wave">👋</span>
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue making a difference in animals' lives.
            </p>
          </div>
          
          {error && <div className="mt-4 bg-red-50 text-red-500 p-3 rounded-lg text-sm font-medium border border-red-100">{error}</div>}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input name="email" type="email" required className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary sm:text-sm transition-all bg-gray-50 focus:bg-white" placeholder="Example@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input name="password" type="password" required className="appearance-none rounded-xl block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary sm:text-sm transition-all bg-gray-50 focus:bg-white" placeholder="At least 6 characters" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </div>
            </div>
            
            <div>
              <button type="submit" className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-darkGrey hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-darkGrey transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
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
            
            <GoogleLoginButton setView={setView} />
            
            <div className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{' '}
              <button type="button" onClick={() => setView('register')} className="font-bold text-brand-primary hover:text-brand-primaryDark transition-colors">
                Sign up
              </button>
            </div>
          </form>
        </div>
        
        {/* Right Side: Image/Animation */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-brand-primaryLight/40 to-brand-secondaryLight/20 items-center justify-center relative p-12">
          <img src={cuteDoggie} alt="Cute dog animation" className="w-full max-w-sm relative z-10 drop-shadow-2xl mix-blend-multiply" />
        </div>
      </div>
    </div>
  );
};

export default Login;
