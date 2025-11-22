import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // npm install lucide-react
import Footer from "../components/Footer";

export default function ResetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // countdown timer logic
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleSendOtp = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("auth/clients/send-otp", { email });
      setMessage(res.data.message);
      setStep(2);
      setCountdown(300); // 5 minutes = 300 seconds
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    if (countdown <= 0) {
      handleSendOtp();
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("auth/clients/verify-otp", { email, otp });
      if (res.data.verified) {
        setMessage(res.data.message);
        setStep(3);
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password) {
      setMessage("Please enter your new password.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("auth/clients/reset-password", { email, password });
      setMessage(res.data.message);
      setStep(1);
      setEmail("");
      setOtp("");
      setPassword("");
      setTimeout(() => navigate('/account'), 2500);
          
    } catch (err) {
      setMessage(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#788DA2]">
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </h2>

          {message && (
            <div className="text-center text-sm text-blue-600 mb-4">{message}</div>
          )}

          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-[#2682C1] text-white py-3 rounded-lg hover:bg-[#2A8ACE] transition"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-[#2682C1] text-white py-3 rounded-lg hover:bg-[#2A8ACE] transition"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="text-sm text-center mt-4 text-gray-600">
                {countdown > 0 ? (
                  <>Resend OTP in <span className="font-semibold">{formatTime(countdown)}</span></>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-purple-600 underline hover:text-[#2A8ACE]"
                  >
                    Resend OTP
                  </button>
                )}
              </p>
            </>
          )}

          {step === 3 && (
            <>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full bg-[#2682C1] text-white py-3 rounded-lg hover:bg-[#2A8ACE] transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          {step > 1 && (
            <p
              className="text-sm text-center mt-4 text-gray-500 cursor-pointer hover:underline"
              onClick={() => {
                setStep(1);
                setCountdown(0);
              }}
            >
              Start over
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
