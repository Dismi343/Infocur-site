import React, { useState } from 'react';
import logo from '../assets/logo_no_back.png';
import prof from '../assets/user_icon_no_back.png';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
    const navigate = useNavigate();


    const logout = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("/auth/admin/logout", {}, {
                withCredentials: true
            });
            if (res.status === 200) {
                //setClient(null);
                navigate("/");
            }
            console.log(res.status);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <nav className="bg-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
                {/* Left section: logo + nav links */}
                <div className="flex items-center gap-6 flex-grow">
                    {/* Logo */}
                    <img src={logo} alt="Logo" className="h-10 sm:h-12" />

                    {/* Nav links (desktop) */}
                    <div className="flex gap-6 text-[#2A8ACE] font-semibold">
                        <Link to="/dashboard">SESSION</Link>
                        <Link to="/bookings">BOOKINGS</Link>
                        <Link to="/progress-events">PROGRESS</Link>
                        {/*<Link to="/portfolio">PORTFOLIO</Link>*/}
                        <Link to="/timeslots">TIME SLOTS</Link>
                        <Link to="/settings">SETTINGS</Link>
                    </div>
                </div>

                {/* Account button (desktop only) */}


                    <button className="flex bg-red-600 text-white px-4 py-2 rounded-lg items-center gap-2 hover:cursor-pointer"
                    onClick={logout}
                    >
                        <span className=" sm:inline">Logout</span>
                        <img src={prof} alt="Account" className="h-6" />

                    </button>

            </div>

        </nav>
    );
};

export default Navbar;
