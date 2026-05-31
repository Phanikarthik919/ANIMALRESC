import React from 'react';
import adoptPetImg from '../assets/adoptPet.png';
import postPetImg from '../assets/postPet.png';

const ServicesSection = ({ setView, setActiveTab }) => {
  return (
    <div className="mt-24 mb-10">
      <h2 className="text-3xl font-extrabold text-brand-darkGrey mb-10 text-center">Our Services</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Half: Adopt a Pet */}
        <div className="md:w-1/2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-brand-primary mb-6">Adopt a Pet</h3>
          <img src={adoptPetImg} alt="Happy Pet" className="h-48 object-contain mb-6" />
          <p className="text-gray-600 mb-6 leading-relaxed">
            Welcome to our pet adoption program! Adopting a pet is a wonderful way to bring joy and companionship into your life. Provide a loving home to a pet in need, experience the unconditional love, and create lasting memories.
          </p>
          <div className="text-left w-full mb-8">
            <h4 className="font-bold text-brand-darkGrey mb-2">Adoption Process:</h4>
            <ol className="list-decimal list-inside text-gray-600 space-y-1">
              <li>Fill out an adoption application</li>
              <li>Meet potential pets in person</li>
              <li>Complete the necessary paperwork</li>
            </ol>
          </div>
          <button onClick={() => {
              if (setActiveTab) setActiveTab('Ready for Adoption');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="mt-auto bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3 px-8 rounded-full shadow-md transition transform hover:-translate-y-1 w-full sm:w-auto">
            Find Your Perfect Pet
          </button>
        </div>

        {/* Right Half: Post a Pet */}
        <div className="md:w-1/2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-brand-primary mb-6">Post a Rescue Pet for Adoption</h3>
          <img src={postPetImg} alt="Pet Looking for a Home" className="h-48 object-contain mb-6" />
          <p className="text-gray-600 mb-6 leading-relaxed">
            Have you found a stray or need to rehome a pet? You can submit a pet for adoption by filling out our rescue form. Our team reviews submissions and lists approved pets on our platform to help them find a loving new home.
          </p>
          <div className="text-left w-full mb-8">
            <h4 className="font-bold text-brand-darkGrey mb-2">What we need:</h4>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Basic information (age, breed, location)</li>
              <li>A clear photo of the pet</li>
              <li>Justification and medical needs</li>
            </ul>
          </div>
          <button onClick={() => {
              setView('new');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="mt-auto bg-brand-primary hover:bg-brand-primaryDark text-white font-bold py-3 px-8 rounded-full shadow-md transition transform hover:-translate-y-1 w-full sm:w-auto">
            Report a Rescue Need
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
