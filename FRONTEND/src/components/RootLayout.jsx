import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import Navbar from './Navbar';
import Footer from './Footer';

const RootLayout = () => {
  const [rescues, setRescues] = useState([]);
  const [selectedRescue, setSelectedRescue] = useState(null);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar setSelectedRescue={setSelectedRescue} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-grow w-full">
        <Outlet context={{ rescues, fetchRescues, selectedRescue, setSelectedRescue }} />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
