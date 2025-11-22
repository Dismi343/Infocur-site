import React, { useEffect, useState } from "react";;
import BackgroundImage from "../assets/event/booking-image.png"; 
//import BackgroundImage from "../assets/event/Bg1.jpg";
import { useNavigate } from "react-router-dom"; 
import Footer from "../components/Footer";
import axios from "axios";
import { useLocation } from "react-router-dom";


const BookingInstructions = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const { eventId, eventName } = location.state || {};

  
  
useEffect(() => {
    axios
      .get("/api/clients/profile", { withCredentials: true })
      .then(() => setLoggedIn(true))
      .catch((error) => {
        if (error.response?.status === 401) {
          console.warn("No active session. go to login...");
          setLoggedIn(false);
          
        } else {
          console.error("Unexpected error:", error);
          setLoggedIn(false);
        }
      });
  }, []);

    const handleButtonClick = () => {
    if (loggedIn) {
      // ✅ If session exists → go to booking page (or next step)
      navigate("/booking-event",{ state: { eventId,eventName } });
    } else {
      // ❌ No session → redirect to login page with next query parameter as booking-event page
      navigate(`/account?next=/booking-event`,{ state: { eventId,eventName } });
    }
  };

  return (
    <>
    <div className="bg-[#788DA2] py-12">
        <div className="max-w-[90%]  h-[90%] mx-auto py-12 ">
            <div
            className="h-[600px] bg-cover bg-center flex items-center justify-start px-4 md:px-16 rounded-2xl font-sora  "
            style={{ backgroundImage: `url(${BackgroundImage})` }}
            >
            <div className="bg-[#E5E5E5] bg-opacity-90 rounded-2xl p-6 md:p-10 w-full max-w-xl">
                <h1 className="text-[#2A8ACE] text-3xl md:text-4xl font-bold mb-6">Booking Instructions</h1>
                <ul className="space-y-4 text-black text-base md:text-lg list-disc list-inside">
                <li>You can only book one outdoor session, and the time slots for outdoor and indoor sessions cannot overlap.</li>
                <li>You need to Login to book a slot.</li>
                <li>You have to pay advance of 50% of the package within 2 days of booking otherwise booking will cancel automatically.</li>
                <li>
                    <span className="text-[#2A8ACE] font-semibold">
                    Limited time slots are available please book now.
                    </span>
                </li>
                </ul>

                <button
                onClick={handleButtonClick}
                className="mt-8 bg-[#2A8ACE] text-white font-bold text-lg px-10 py-3 rounded-xl hover:bg-blue-600 transition duration-200"
                >
                {loggedIn ? "Proceed to Booking" : "Login"}
                </button>
            </div>
            </div>
        </div>
        
    </div>
    <Footer/>
    </>
  );
};

export default BookingInstructions;
