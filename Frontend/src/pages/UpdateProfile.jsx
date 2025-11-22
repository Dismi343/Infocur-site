import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer2";

function UpdateProfile() {
  const { state } = useLocation();
  const user = state?.Client || state?.cId || {}; // handle both possible cases
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    faculty: "",
    regNumber: "",
    userType: "",
    email: "",
    mnumber: "",
  });

  const [message, setMessage] = useState("");

  // ✅ Prefill form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        faculty: user.faculty || "",
        regNumber: user.regNumber || "",
        userType: user.userType || "",
        email: user.email || "",
        mnumber: user.mnumber || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`/api/clients/update-Client/${user.id}`, formData);
      
        if (res.status === 201) {
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => {
        navigate("/dashboard", { state: { from: "update-profile" } });
      }, 1000);
        
      }
    } catch (err) {
      setMessage("❌ Error updating profile.");
      console.error(err);
    }
  };

  return (
    <>
      <div className="bg-[#788DA2] py-30 min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md w-[90%] md:w-[400px]"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">
            Update Profile
          </h2>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600 font-medium">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Mobile Number */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600 font-medium">
              Mobile Number
            </label>
            <input
              type="text"
              name="mnumber"
              value={formData.mnumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Faculty (Read-only) */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600 font-medium">Faculty</label>
            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Registration Number (Read-only) */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600 font-medium">
              Registration Number
            </label>
            <input
              type="text"
              name="regNumber"
              value={formData.regNumber}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* User Type (Read-only) */}
          <div className="mb-6">
            <label className="block mb-1 text-gray-600 font-medium">
              User Type
            </label>
            <input
              type="text"
              name="userType"
              value={formData.userType}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Save Changes
          </button>

          {message && (
            <p className="text-center mt-4 text-sm text-gray-700">{message}</p>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
}

export default UpdateProfile;
