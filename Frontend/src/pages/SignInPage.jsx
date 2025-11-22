import React, { useState } from 'react';
import owl from '../assets/owl.png';
import Footer from '../components/Footer';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from "lucide-react"; // 👁️ Password toggle icons

function SignInPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    faculty: '',
    userType: '',
    regNumber: '',
    email: '',
    mnumber: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [lockedFields, setLockedFields] = useState({
    regNumber: false,
    faculty: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  const faculties = ['Science', 'Engineering', 'Management & Finance', 'Humanities and Social Sciences', 'Agriculture', 'Allied Health', 'Fisheries and Marine Sciences & Technologies', 'Medicine', 'Technology','Graduate Studies'];
  const userTypes = ['Student', 'Lecturer'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === "regNumber" || name === "faculty") && !lockedFields[name] && value !== "") {
      setLockedFields((prev) => ({ ...prev, [name]: true }));
    }
    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.fullName) newErrors.fullName = true;
    if (!form.faculty) newErrors.faculty = true;
    if (!form.userType) newErrors.userType = true;
    if (!form.password) newErrors.password = "Password is required";
    if (form.password && form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!form.regNumber) newErrors.regNumber = true;
    if (!form.email) newErrors.email = true;
    if (!form.mnumber) newErrors.mnumber = true;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    try {
      await axios.post("api/clients/create", form);
      alert("User created successfully!");
      setForm({
        fullName: '',
        faculty: '',
        userType: '',
        regNumber: '',
        email: '',
        mnumber: '',
        password: '',
      });
    } catch (e) {
      if (e.response && e.response.data.code === 409) {
        setErrors({ regNumber: "This registration number already exists." });
      } else {
        console.error(e);
        alert("User not created. Something went wrong.");
      }
    }
  };

  return (
    <>
      <div className="bg-[#6c8fa8] flex flex-col min-h-screen font-sora">
        <main className="flex-grow flex items-center justify-center py-5 px-5 mt-20">
          <div className="rounded-xl shadow-md flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
            
            {/* Left Side */}
            <div className="bg-[#D9D9D9] w-full md:w-1/2 flex flex-col items-center justify-center p-6">
              <h2 className="text-3xl font-bold text-[#2A8ACE] mb-4">WELCOME!</h2>
              <img src={owl} alt="Owl" className="w-40 md:w-60 h-auto" />
            </div>

            {/* Right Side */}
            <div className="bg-[#979797] text-white w-full md:w-1/2 p-6 md:p-10">
              <h2 className="text-2xl font-semibold mb-6 text-center">SIGN IN</h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Full Name */}
                <label className="text-white font-semibold text-sm mb-1 block">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-2 rounded bg-gray-200 text-black ${errors.fullName ? 'border-2 border-red-500' : ''}`}
                  value={form.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <p className="text-red-700 text-sm mt-1">Please enter your full name</p>}

                {/* Faculty */}
                <label className="text-white font-semibold text-sm mb-1 block">Faculty</label>
                <select
                  className={`w-full px-4 py-2 rounded bg-[#a5a2e3] text-black ${errors.faculty ? 'border-2 border-red-500' : ''}`}
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                >
                  <option value="">Select faculty</option>
                  {faculties.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
                {errors.faculty && !lockedFields.faculty && <p className="text-red-700 text-sm mt-1">Please select your faculty</p>}
                {lockedFields.faculty && <p className="text-yellow-300 text-sm mt-1">⚠️ You can’t change faculty later.</p>}

                {/* User Type */}
                <label className="text-white font-semibold text-sm mb-1 block">User Type</label>
                <select
                  className={`w-full px-4 py-2 rounded bg-[#a5a2e3] text-black ${errors.userType ? 'border-2 border-red-500' : ''}`}
                  name="userType"
                  value={form.userType}
                  onChange={handleChange}
                >
                  <option value="">Select user type</option>
                  {userTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.userType && <p className="text-red-700 text-sm mt-1">Please select user type</p>}

                {/* Password */}
                <label className="text-white font-semibold text-sm mb-1 block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-2 rounded bg-gray-200 text-black pr-10 ${errors.password ? 'border-2 border-red-500' : ''}`}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-600 hover:text-gray-800"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {form.password && form.password.length < 8 && (
                  <p className="text-yellow-300 text-sm">Password should be at least 8 characters long</p>
                )}
                {errors.password && (
                  <p className="text-red-700 text-sm mt-1">{errors.password}</p>
                )}

                {/* Registration Number */}
                <label className="text-white font-semibold text-sm mb-1 block">Registration Number</label>
                <input
                  type="text"
                  placeholder="Enter your registration number"
                  className={`w-full px-4 py-2 rounded bg-gray-200 text-black ${errors.regNumber ? 'border-2 border-red-500' : ''}`}
                  name="regNumber"
                  value={form.regNumber}
                  onChange={handleChange}
                />
                {errors.regNumber && (
                  <p className="text-red-700 text-sm mt-1">Please enter your registration number</p>
                )}
                {lockedFields.regNumber && (
                  <p className="text-yellow-300 text-sm mt-1">⚠️ You can’t change registration number later.</p>
                )}

                {/* Email */}
                <label className="text-white font-semibold text-sm mb-1 block">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 rounded bg-gray-200 text-black ${errors.email ? 'border-2 border-red-500' : ''}`}
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-700 text-sm mt-1">Please enter your email</p>
                )}

                {/* Mobile Number */}
                <label className="text-white font-semibold text-sm mb-1 block">Mobile Number</label>
                <input
                  type="text"
                  placeholder="Enter your mobile number"
                  className={`w-full px-4 py-2 rounded bg-gray-200 text-black ${errors.mnumber ? 'border-2 border-red-500' : ''}`}
                  name="mnumber"
                  value={form.mnumber}
                  onChange={handleChange}
                />
                {errors.mnumber && (
                  <p className="text-red-700 text-sm mt-1">Please enter your mobile number</p>
                )}

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-10 mt-5 gap-4">
                  <p className="text-white text-sm text-center sm:text-left">
                    Do you have an account?{" "}
                    <button
                      type="button"
                      className="underline cursor-pointer"
                      onClick={() => navigate("/account")}
                    >
                      Log in
                    </button>
                  </p>

                  <button
                    type="submit"
                    className={`px-6 py-2 rounded-xl text-white transition ${
                      form.password.length < 8
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-[#2A8ACE] hover:bg-blue-700"
                    }`}
                    disabled={form.password.length < 8}
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default SignInPage;
