import React from 'react';
import sheep from '../assets/Cute Sheep Animal.svg';

const Volunteer = () => {
  return (
    <div className="px-4 py-8 sm:px-0 flex justify-center max-w-7xl mx-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-3xl w-full border border-gray-100">
        <div className="text-center mb-10 flex flex-col items-center">
          <img src={sheep} alt="Cute Sheep" className="h-40 mb-6 drop-shadow-lg" />
          <h2 className="text-4xl font-extrabold text-brand-primary mb-4">Become a Volunteer</h2>
          <p className="text-gray-600 text-lg">We are always looking for passionate individuals. Join our network of heroes and make a real difference in the lives of animals.</p>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-brand-primary focus:border-brand-primary" placeholder="John" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-brand-primary focus:border-brand-primary" placeholder="Doe" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input type="email" className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-brand-primary focus:border-brand-primary" placeholder="john@example.com" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input type="tel" className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-brand-primary focus:border-brand-primary" placeholder="+1 (555) 000-0000" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">How would you like to help?</label>
            <select className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-brand-primary focus:border-brand-primary">
              <option>Foster Parent (Temporary Housing)</option>
              <option>Transport / Ambulance Driver</option>
              <option>Medical Assistant</option>
              <option>Event & Fundraising Helper</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tell us about your experience</label>
            <textarea rows="4" className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:ring-brand-primary focus:border-brand-primary" placeholder="I have previously fostered dogs and have a large backyard..."></textarea>
          </div>

          <button type="button" className="w-full bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-4 px-4 rounded-xl shadow-lg transition duration-150 ease-in-out text-lg">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default Volunteer;
