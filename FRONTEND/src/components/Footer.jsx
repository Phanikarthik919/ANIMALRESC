import React from 'react';
import {
  footerClass,
  footerContainer,
  footerLinkClass,
  footerInputClass,
} from '../styles/common';

const Footer = () => {
  return (
    <footer className={footerClass}>
      <div className={footerContainer}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-brand-primary mb-4">Animal Rescue Network</h2>
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              Rescuing, rehabilitating, and rehoming street animals. Join our mission to give every animal a loving home and the medical care they deserve.
            </p>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className={footerLinkClass}>Dashboard</a></li>
              <li><a href="#" className={footerLinkClass}>Report Rescue</a></li>
              <li><a href="#" className={footerLinkClass}>Campaigns</a></li>
              <li><a href="#" className={footerLinkClass}>Blogs</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-semibold mb-2 text-white">Subscribe to our Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">Get updates on rescue stories, campaigns, and emergency SOS alerts.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className={footerInputClass}
              />
              <button className="bg-brand-primary hover:bg-brand-primaryDark text-white font-bold px-6 py-2 rounded-r-lg transition">
                Subscribe
              </button>
            </div>
          </div>
          
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Animal Rescue Network. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
