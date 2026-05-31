import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import cuteCat from '../assets/Cute CAT Animal.svg';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Profile');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Adoption Services' // Mock data to match screenshot
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role === 'user' ? 'Adopter / Public' : 'Volunteer',
        department: 'Adoption Services'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    
    const res = await updateProfile({ name: formData.name });
    if (res.success) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage(res.message || 'Error updating profile.');
    }
    
    setIsSaving(false);
    
    setTimeout(() => {
      setMessage('');
    }, 3000);
  };

  const tabs = ['Profile', 'Notification', 'Integration', 'Subscription'];

  if (!user) return <div className="text-center py-20">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header & Tabs */}
        <div className="px-8 pt-8 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-brand-primary text-brand-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'Profile' ? (
            <div className="space-y-8">
              
              {/* Picture Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Profile</h3>
                <label className="block text-sm font-medium text-gray-700 mb-2">Picture</label>
                <div className="flex items-center space-x-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-brand-primaryLight text-brand-primary flex items-center justify-center text-xl font-bold shadow-inner">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name ? user.name.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <button type="button" className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-brand-primaryDark transition-colors">
                    Update Picture
                  </button>
                </div>
              </div>

              {/* Form Section */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      value={formData.department}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={isSaving || formData.name === user.name}
                    className="bg-brand-darkGrey text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  {message && (
                    <span className={`text-sm font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                      {message}
                    </span>
                  )}
                </div>
              </form>

              <hr className="border-gray-100" />

              {/* Password Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Password</h3>
                <button type="button" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
                  Change My Password
                </button>
              </div>

              <hr className="border-gray-100" />

              {/* 2FA Section */}
              <div className="pb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Two Factor Authenticator</h3>
                <button type="button" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
                  Two Factor Authenticator
                </button>
              </div>

            </div>
          ) : (
            <div className="py-16 text-center text-gray-500 flex flex-col items-center">
              <img src={cuteCat} alt="Cute cat" className="h-32 mb-4 drop-shadow-md" />
              <p className="text-xl font-bold text-gray-800 mb-2">{activeTab}</p>
              <p className="text-md font-medium text-gray-500">Settings coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
