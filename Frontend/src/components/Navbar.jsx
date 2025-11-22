import React, { useState, useEffect } from 'react';
import logo from '../assets/logo_no_back.png';
import prof from '../assets/user_icon_no_back.png';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // adjust 50 to make transition earlier/later
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const profile = async () => {
    try {
      const res = await axios.get('api/clients/profile');
      if (res.status === 401) {
        navigate('/account');
        return;
      }
      navigate('/dashboard');
    } catch (e) {
      console.error('Error fetching client data:', e);
      navigate('/account');
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300 
      ${scrolled ? 'bg-gray-200/75 backdrop-blur-md shadow-md' : 'bg-gray-200'}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6 flex-grow">
          <img src={logo} alt="Logo" className="h-10 sm:h-12" />
          <div className="hidden md:flex gap-6 text-[#2A8ACE] font-semibold">
            <Link to="/">HOME</Link>
            <Link to="/booking">BOOKING</Link>
            <Link to="/team">TEAM</Link>
          </div>
        </div>

        <button
          className="md:hidden text-[#2A8ACE] mr-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <button
          className="hidden md:flex bg-[#2A8ACE] text-white px-4 py-2 rounded-lg items-center gap-2 hover:cursor-pointer"
          onClick={profile}
        >
          <span className="hidden sm:inline">ACCOUNT</span>
          <img src={prof} alt="Account" className="h-6" />
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden md:hidden ${
          menuOpen ? 'max-h-screen mt-4' : 'max-h-0'
        }`}
      >
        <div className="flex flex-col gap-4 text-[#2A8ACE] font-semibold">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            HOME
          </Link>
          <Link to="/booking" onClick={() => setMenuOpen(false)}>
            BOOKING
          </Link>
          <Link to="/team" onClick={() => setMenuOpen(false)}>
            TEAM
          </Link>
          <Link to="/account" onClick={() => setMenuOpen(false)}>
            <button className="bg-[#2A8ACE] text-white px-4 py-2 rounded-lg flex items-center gap-2 w-max"
                    onClick={profile}
            >
              <span>ACCOUNT</span>
              <img src={prof} alt="Account" className="h-6" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
