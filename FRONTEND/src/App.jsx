import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from './config/api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import ReportRescue from './pages/ReportRescue';
import Contact from './pages/Contact';
import Campaigns from './pages/Campaigns';
import Volunteer from './pages/Volunteer';
import Blogs from './pages/Blogs';
import Login from './pages/Login';
import Register from './pages/Register';
import ApplyAdoption from './pages/ApplyAdoption';
import ReviewAdoptions from './pages/ReviewAdoptions';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [rescues, setRescues] = useState([]);
  const [selectedRescue, setSelectedRescue] = useState(null);
  const [view, setView] = useState('list'); // list, new, contact, campaigns, volunteer, blogs, login, register, apply-adoption, review-adoptions

  const fetchRescues = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/rescues`);
      setRescues(response.data);
    } catch (error) {
      console.error('Error fetching rescues:', error);
    }
  };

  useEffect(() => {
    fetchRescues();
  }, []);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar view={view} setView={setView} setSelectedRescue={setSelectedRescue} />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-grow w-full">
          {view === 'list' && <Dashboard rescues={rescues} setView={setView} fetchRescues={fetchRescues} setSelectedRescue={setSelectedRescue} />}
          {view === 'new' && <ReportRescue setView={setView} refreshRescues={fetchRescues} />}
          {view === 'contact' && <Contact />}
          {view === 'campaigns' && <Campaigns />}
          {view === 'volunteer' && <Volunteer />}
          {view === 'blogs' && <Blogs />}
          {view === 'login' && <Login setView={setView} />}
          {view === 'register' && <Register setView={setView} />}
          {view === 'apply-adoption' && <ApplyAdoption selectedRescue={selectedRescue} setView={setView} />}
          {view === 'review-adoptions' && <ReviewAdoptions setView={setView} selectedRescue={selectedRescue} setSelectedRescue={setSelectedRescue} />}
          {view === 'profile' && <Profile />}
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
