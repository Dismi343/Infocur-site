import React, { useState } from 'react';
import owl from '../assets/owl.png';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // 👁️ for visibility toggle

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { eventId, eventName } = location.state || {};

  const params = new URLSearchParams(location.search);
  const next = params.get("next") || "/dashboard";

  const [regNumber, setRegNumber] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("auth/clients/login", {
        regNumber,
        password,
        withCredentials: true
      });

      setMessage(`
        Welcome ${res.data.data.regNumber},
        Name: ${res.data.data.fullName},
        Faculty: ${res.data.data.faculty}
      `);

      navigate('/dashboard');
      navigate(next, { state: { eventId, eventName } });
    } catch (e) {
      console.error(e);
      setMessage('Invalid RegNumber or password');
    }
  };

  return (
    <>
      <div className="py-10 bg-[#7B9EB1] flex justify-center items-center min-h-screen">
        <div className="flex flex-col md:flex-row w-full max-w-[900px] rounded-xl overflow-hidden shadow-lg font-sora mx-4 mt-20">

          {/* Left side */}
          <div className="bg-[#D9D9D9] flex flex-col items-center justify-center px-6 py-8 md:px-8 md:py-0 md:w-1/2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#2682C1] mt-4 mb-4 text-center">WELCOME!</h1>
            <img src={owl} alt="Owl with Camera" className="w-[200px] md:w-[250px] h-auto object-contain" />
          </div>

          {/* Right side */}
          <div className="bg-[#979797] flex flex-col py-8 px-6 md:px-10 md:w-1/2">
            <div className='flex flex-col justify-center items-center'>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">LOGIN</h2>
            </div>

            <form onSubmit={handleLogin}>
              {/* Register Number */}
              <label className="text-white font-semibold text-sm mb-1 block">Register No</label>
              <input
                type="text"
                placeholder="Enter your Register Number"
                className="p-2 mb-4 rounded bg-[#D9D9D9] w-full font-semibold text-black"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
              />

              {/* Password */}
              <label className="text-white font-semibold text-sm mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  className="p-2 mb-4 rounded bg-[#D9D9D9] w-full font-semibold text-black pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Forgot password */}
              <div className="flex items-center mt-3 mb-4">
                <p className="text-white text-sm text-center">
                  <button
                    type="button"
                    className="underline cursor-pointer"
                    onClick={() => navigate('/reset-password')}
                  >
                    Forgot password?
                  </button>
                </p>
              </div>

              {/* Submit */}
              <div className='flex flex-col mt-4 items-center'>
                <button
                  className="bg-[#2682C1] font-semibold text-white py-2 rounded-2xl w-full md:w-[175px] mb-4"
                  type="submit"
                >
                  Login
                </button>
              </div>
            </form>

            {message && <p className="text-white text-center mt-2 text-sm">{message}</p>}

            {/* Sign up link */}
            <div className='flex flex-col mt-5 items-center'>
              <p className="text-white text-sm text-center">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="underline cursor-pointer"
                  onClick={() => navigate('/signin')}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
