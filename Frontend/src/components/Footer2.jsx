import React from 'react';
import logo from '../assets/logo_no_back.png';
import { Mail, Facebook, Instagram } from 'lucide-react';

const Footer2 = () => {
  return (
    <footer className="bg-[#406383] text-white font-sora py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-15 items-start text-sm md:text-base">
        {/* Logo and Address */}
        <div className="flex flex-col text-center gap-3 ">
          <img src={logo} alt="Logo" className="h-30px" />
          <p className="font-medium">University of Ruhuna, A2, Matara</p>
        </div>


        {/* Site Map */}
        <div className='items-center text-center'>
          <h3 className="text-white font-bold mb-2">Site Map</h3>
          <ul className="text-[#8ec3f4] space-y-1">
            <li><a href="#">Home</a></li>
            <li><a href="#">Booking</a></li>
            <li><a href="#">Team</a></li>
            <li><a href="#">Account</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="items-center text-center">
          <h3 className="text-white font-bold mb-2">Contact Us</h3>
          <p className="text-[#8ec3f4]">Infocur@usci.ruh.ac.lk</p>
        </div>

        {/* Follow Icons */}
        <div className="items-center text-center mx-auto">
          <h3 className="text-white font-bold mb-2">Follow</h3>
          <div className="flex space-x-4 text-[#8ec3f4] items-center">
            <Mail className="w-6 h-6 stroke-[1.5px]" />
            <Facebook className="w-6 h-6 stroke-[1.5px]" />
            <Instagram className="w-6 h-6 stroke-[1.5px]" />
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-white text-md mt-6">
        <p><span className="font-bold">Team Infocur</span> © 2025 All rights Reserved</p>
      </div>
    </footer>
  );
};

export default Footer2;
