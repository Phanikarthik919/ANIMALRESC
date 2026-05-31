import React from 'react';
import elephant from '../assets/cute elephant animal.svg';

const Campaigns = () => {
  const campaigns = [
    { id: 1, title: 'Fund an Animal Ambulance', goal: 50000, raised: 12500, description: 'Help us purchase a fully equipped ambulance to rescue injured animals rapidly.' },
    { id: 2, title: 'Donate a Bed for Strays', goal: 2000, raised: 1800, description: 'Provide warm, comfortable beds for animals recovering from surgery in our facility.' },
    { id: 3, title: '100 Rabies Vaccines Drive', goal: 1000, raised: 400, description: 'Sponsor our upcoming weekend vaccination drive to protect local street dogs.' }
  ];

  return (
    <div className="px-4 py-8 sm:px-0 max-w-7xl mx-auto animate-fadeIn">
      <div className="text-center mb-12 flex flex-col items-center">
        <img src={elephant} alt="Cute Elephant" className="h-40 mb-6 drop-shadow-lg" />
        <h2 className="text-4xl font-extrabold text-brand-darkGrey mb-4">Urgent Campaigns</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Your direct contribution to these specific campaigns ensures we have the resources needed to save more lives.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {campaigns.map(camp => (
          <div key={camp.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{camp.title}</h3>
            <p className="text-gray-600 mb-6 flex-grow">{camp.description}</p>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
                <span>Raised: ${camp.raised}</span>
                <span>Goal: ${camp.goal}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-brand-primary h-3 rounded-full" style={{ width: `${(camp.raised / camp.goal) * 100}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 text-right mt-2">{Math.round((camp.raised / camp.goal) * 100)}% Funded</p>
            </div>
            
            <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition duration-150 ease-in-out shadow-md">
              Contribute Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
