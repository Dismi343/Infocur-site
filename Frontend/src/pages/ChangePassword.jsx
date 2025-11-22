import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";


function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    if (newPassword !== retypePassword) {
      setMessage("⚠️ New passwords do not match");
      setIsLoading(false);
      return;
    }
    else if(currentPassword == retypePassword){
      setMessage( "⚠️ New password should not be same as the current password" );
      setIsLoading(false);
      return;
    }

    if (!currentPassword || !newPassword || !retypePassword) {
      setMessage("⚠️ Please fill all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/clients/update-password",
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmNewPassword: retypePassword
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.message) {
        setMessage("✅ " + response.data.message);
      } else {
        setMessage("✅ Password updated successfully!");
      }

      // Clear form fields on success
      setCurrentPassword("");
      setNewPassword("");
      setRetypePassword("");
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      

    } catch (error) {
      console.error("Error updating password:", error);

      if (error.response && error.response.data && error.response.data.message) {
        setMessage("❌ " + error.response.data.message);
      } else if (error.response && error.response.status === 401) {
        setMessage("❌ You are not logged in. Please log in first.");
      } else if (error.response && error.response.status === 400) {
        setMessage("❌ Invalid password or request. Please check your current password.");
      } else {
        setMessage("❌ Error updating password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-[#788DA2] ">
    <div className="py-30 flex  justify-center items-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-[90%] sm:w-[400px]"
      >
        <h2 className="text-xl font-semibold text-center mb-6">
          Change Password
        </h2>

        {/* Current Password */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
            required
            disabled={isLoading}
          />
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            required
            disabled={isLoading}
          />
        </div>

        {/* Retype Password */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Retype New Password</label>
          <input
            type="password"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-green-200"
            required
            disabled={isLoading}
          />
        </div>

        {/* Submit Button */}
        <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white font-medium transition-all ${
                isLoading
                  ? "bg-[#2A8ACE] opacity-70 cursor-not-allowed"
                  : "bg-[#2A8ACE] hover:bg-blue-700"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>

        {/* Message */}
        {message && (
          <p className={`text-center text-sm mt-4 font-medium ${
            message.includes('✅') ? 'text-green-600' : 
            message.includes('⚠️') || message.includes('❌') ? 'text-red-600' : 
            'text-gray-700'
          }`}>
            {message}
          </p>
        )}
      </form>
    </div>
    <Footer/>
    </div>
  );
}

export default ChangePassword;
