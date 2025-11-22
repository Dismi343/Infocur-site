import React from 'react';
import logo from '../assets/logo_no_back.png';

const Footer = () => { 
return ( 
   <footer> 
        <div className="bg-[#406383] text-white py-6 flex flex-col items-center justify-center text-center">
        <img src={logo} alt="Logo" className="h-20" />
        <p className="text-sm mt-2">Team Infocur © 2025 All rights reserved</p>
        </div>
    </footer>

    ); 
}; 

export default Footer;