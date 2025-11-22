import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, } from "react-router-dom";
import Footer2 from "../components/Footer2";

function Dashboard() {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
   const [loading, setLoading] = useState(true);
  //const [clientId, setClientId] = useState([]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const res = await axios.get("api/clients/profile", {
          withCredentials: true,
        });
        setClient(res.data);
       // setClientId(res.data.id);
      } catch (e) {
        console.error("Error fetching client data:", e);
        setClient(null);
        navigate("/account");
      }finally{
        setLoading(false);
      }
    };
    fetchClient();
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("auth/clients/logout", {}, {
        withCredentials: true
      });
      if (res.status === 200) {
        setClient(null);
        navigate("/account");
      }
    } catch (e) {
      console.log(e);
    }
  };

 const handleUpdateProfile = () => {
  if (client) {
    navigate(`/update-profile/`, { state: { Client:client} });
  } else {
    console.warn("Client ID not found");
  }
};



  {/*if (!client)
    return (
      <p className="text-center text-gray-500 mt-20 text-lg">
        Loading profile...
      </p>
    );
    */}
  return (
    <>
    {(loading ? (
        <div className="flex items-center justify-center h-screen bg-[#2A8ACE]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
        </div>
      </div>
      ):(
    <div className=" bg-[#788DA2] mt-20">
    <div className="  flex flex-col items-center py-6 px-3 sm:px-6">
      {/* Logout button */}
      <div className="w-full flex justify-end max-w-3xl">
        <button
          onClick={logout}
          className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 sm:px-5 rounded-xl shadow-md transition text-sm sm:text-base"
        >
          Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 w-full max-w-3xl mt-6 ">
        {/* Avatar + Basic Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="flex flex-col w-4/6 sm:flex-row items-center sm:items-start gap-4 sm:gap-6 ">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
              {client.fullName.charAt(0)}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                {client.fullName}
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">{client.email}</p>
            </div>
          </div>
          <div className="w-2/6 flex justify-end">
            <button
              onClick={handleUpdateProfile}
                className="text-black bg-[#8ec3f4] px-4 py-2 sm:px-5 rounded-xl shadow-md transition text-sm sm:text-base hover:cursor-pointer"
            >
              Update Profile
            </button>
          </div>
        </div>


        {/* Details */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-500">Registration Number</p>
            <p className="font-semibold text-sm sm:text-base">{client.regNumber}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-500">Faculty</p>
            <p className="font-semibold text-sm sm:text-base">{client.faculty}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-500">Mobile Number</p>
            <p className="font-semibold text-sm sm:text-base">{client.mnumber}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg shadow-sm text-center sm:text-left">
            <p className="text-xs sm:text-sm text-gray-500">User Type</p>
            <p className="font-semibold text-sm sm:text-base">{client.userType}</p>
          </div>
          <div onClick={() => navigate("/your-bookings")} className="min-h-[75px] p-4 bg-[#8ec3f4] rounded-lg shadow-sm text-center sm:text-left hover:cursor-pointer">
            <p className="text-md sm:text-sm text-black font-semibold">Your Bookings</p>
          </div>
          <div onClick={() => navigate("/change-password")} className="min-h-[75px] p-4 bg-[#8ec3f4] rounded-lg shadow-sm text-center sm:text-left hover:cursor-pointer">
            <p className="text-md sm:text-sm text-black font-semibold">Change Password</p>
          </div>
          {/*<div onClick={() => navigate("/track-booking")} className=" col-span-2 min-h-[75px]  p-4 bg-[#8ec3f4] rounded-lg shadow-sm text-center sm:text-left hover:cursor-pointer">
            <p className="text-md sm:text-sm text-black font-semibold">Track your Booking</p>
          </div>*/}
        </div>
      </div>
    </div>
    <Footer2/>
    </div>
    ))}
    </>
  );
}

export default Dashboard;
