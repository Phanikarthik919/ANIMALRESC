import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import heroDog from '../assets/animal.svg';
import footprint from '../assets/footPrint.png';
import { AuthContext } from '../context/AuthContext';
import {
  heroSection,
  pageTitleClass,
  bodyText,
  primaryBtn,
  secondaryBtn,
} from '../styles/common';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <div className={heroSection}>
       <img src={footprint} alt="footprint" className="absolute opacity-[0.03] w-64 top-0 left-0 transform -translate-x-1/4 -translate-y-1/4" />
       <img src={footprint} alt="footprint" className="absolute opacity-[0.03] w-48 bottom-0 right-1/4 transform translate-y-1/4 rotate-12" />
       <div className="md:w-1/2 z-10 md:pl-8">
         <h2 className={pageTitleClass + " mb-6"}>Every Pet Deserves a <br/><span className="text-brand-primary bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-primaryDark">Loving Home</span></h2>
         <p className={bodyText + " mb-6 text-lg max-w-lg"}>Join our network of heroes. Report rescues, donate to medical needs, or claim a rescue to give them a second chance.</p>
         
         {!user && (
           <div className="mb-8 flex items-center bg-white/60 p-4 rounded-xl border border-orange-100 backdrop-blur-sm inline-block">
             <span className="text-sm font-semibold text-gray-700">
               <span className="text-brand-primary font-bold mr-1">🌟 New here?</span>
               <button onClick={() => navigate('/register')} className="underline hover:text-brand-primary transition-colors font-bold mr-1">Register</button> 
               to report, adopt, or volunteer!
             </span>
           </div>
         )}

         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
           <button onClick={() => navigate('/new')} className={primaryBtn + " text-center"}>Report a Rescue Now</button>
           {!user && (
             <button onClick={() => navigate('/register')} className={secondaryBtn + " text-center"}>Sign Up</button>
           )}
         </div>
       </div>
       <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center z-10 relative">
         <div className="absolute inset-0 bg-brand-primaryLight rounded-full blur-3xl opacity-20 transform translate-y-10 scale-125"></div>
         <img src={heroDog} alt="Animated Animal" className="h-72 md:h-96 object-contain relative z-10 drop-shadow-2xl hover:scale-105 transition-transform duration-500" />
       </div>
    </div>
  );
};

export default Hero;
