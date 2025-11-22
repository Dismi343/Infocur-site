import Footer from "../components/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function BookingEvent() {
  const location = useLocation();
  const { eventId, eventName } = location.state || {};

  const [eventDetails, setEventDetails] = useState(null);
  const [eventSessions, setEventSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Indoor");
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const navigate = useNavigate();
  

  // Form Selections
  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ added
  const [hasIndoor, setHasIndoor] = useState(false);
  const [hasOutdoor, setHasOutdoor] = useState(false);

  const [client, setClient] = useState(null);
  const [formData, setFormData] = useState({
    clientId: null,
    sessionId: null,
    packageId: null,
    date: null,
  });

  useEffect(() => {
    if (eventId) loadData();
  }, [eventId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [eventRes, sessionRes] = await Promise.all([
        axios.get(`/api/events/find/${eventId}`,{
          withCredentials: true,
        }),
        axios.get(`/api/events/slots/${eventId}`, {
          params: { searchText: "", page: 0, size: 100 },
          withCredentials: true,
        }),
      ]);
      setEventDetails(eventRes.data.data);
      setEventSessions(sessionRes.data.data || []);
      const sessions = sessionRes.data.data || [];

      setHasIndoor(sessions.some((s) => s.sessionType === "Indoor"));
      setHasOutdoor(sessions.some((s) => s.sessionType === "Outdoor"));

    // Auto-select correct tab
      if (sessions.some((s) => s.sessionType === "Indoor") && !sessions.some((s) => s.sessionType === "Outdoor")) {
        setActiveTab("Indoor");
      } else if (!sessions.some((s) => s.sessionType === "Indoor") && sessions.some((s) => s.sessionType === "Outdoor")) {
        setActiveTab("Outdoor");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch client profile
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axios.get("/api/clients/profile", {
          withCredentials: true,
        });
        setClient(res.data);
      } catch (e) {
        console.error("Error fetching client data:", e);
        setClient(null);
        navigate('/account');
      }
    };
    fetchClient();
  }, []);

  // Keep formData in sync
  useEffect(() => {
    setFormData({
      sessionId: selectedSession,
      packageId: selectedPackage,
    });
  }, [client, selectedSession, selectedPackage]);

  useEffect(() => {
    console.log("Form Data Changed:", formData);
  }, [formData]);

  // ✅ Handle Booking
  const handleBook = async () => {
    if (!formData.sessionId || !formData.packageId) {
      alert("Please select both a session and a package.");
      return;
    }

    try {
       setBookingStatus("loading"); 
       setBookingMessage("Loading");
      const requestForm = new FormData();

      // ✅ Append file only if user selected one
      if (selectedFile) {
        requestForm.append("file", selectedFile);
      }else {
        // Append an empty Blob so "file" key still exists
        requestForm.append("file", new Blob([]), "");
        }

      // booking details JSON
      const bookingData = {
        sessionId: formData.sessionId,
        packageId: formData.packageId,
        status: "false",
      };

      requestForm.append(
        "data",
        new Blob([JSON.stringify(bookingData)], { type: "application/json" })
      );

      const res = await axios.post(
        "http://localhost:8081/api/bookings/create",
        requestForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      //alert("Booking created successfully!");
      console.log("Booking Response:", res.data);
      setBookingStatus("success");
      setBookingMessage("Booking Successfull");
      //Navigate('/your-bookings');
      setTimeout(() => {
      setBookingStatus(null);
      navigate("/your-bookings"); // 🔥 Redirect to bookings page
    }, 500);
    
    } catch (error) {
      console.error("Error creating booking:", error);
        setBookingStatus("error");

        let message = "Failed to create booking!";
        if (error.response?.data?.message) {
          message = error.response.data.message; // ✅ shows backend message
        } else if (error.message === "Network Error") {
          message = "Network error. Please try again.";
        }
        if (error.response?.data?.message === "Booking already exists for this session") {
          setBookingMessage(message);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setBookingMessage("Refreshing...");
          
          await new Promise((resolve) => setTimeout(resolve, 1500));
          window.location.reload();
        }
        if (error.response?.data?.message !== "Booking already exists for this session"){
        setBookingMessage(message);}
        setTimeout(() => setBookingStatus(null), 2500);
          } 
  };

  // =======================
  // UI Section
  // =======================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#2A8ACE]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
    <div className="bg-[#788DA2] py-12">
        {bookingStatus && (
                <div
                  className={`fixed top-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-fadeIn ${
                    bookingStatus === "loading"
                      ? "bg-[#2A8ACE] text-white"
                      : bookingStatus === "success"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {bookingStatus === "loading" && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  )}

                  <span className="font-semibold">{bookingMessage}</span>
                </div>
              )}

      <div className="max-w-[90%] h-[90%] mx-auto py-12">
        <div className="bg-[#E5E5E5] bg-opacity-90 rounded-2xl p-6 md:p-10 w-full">
          <h1 className="text-[#2A8ACE] text-3xl md:text-4xl font-bold mb-6">
            Event name: {eventName}
          </h1>

          {eventDetails && (
            <h1 className="text-[#2A8ACE] text-2xl font-bold mb-12">
              Date: {eventDetails.date}
            </h1>
          )}

          {/* Tab Section — omitted for brevity (same as before) */}
          {/* Tab Selection */}
          <div>
            <p className="font-semibold text-lg mr-5 mb-5">Select a Section</p>
            <div className="flex gap-4 mb-6">
                {[
                  { label: "Indoor", available: hasIndoor },
                  { label: "Outdoor", available: hasOutdoor },
                ].map(({ label, available }) => (
                  <button
                    key={label}
                    onClick={() => {
                      if (!available) return; // 🔒 prevent clicking when no sessions
                      setActiveTab(label);
                      setSelectedSession(null);
                      setSelectedPackage(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ${
                      !available
                        ? "bg-gray-300 text-gray-500 opacity-60 cursor-not-allowed"
                        : activeTab === label
                        ? "bg-[#2A8ACE] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {label}
                    {!available && (
                      <span className="ml-2 text-xs bg-gray-400 text-white px-2 py-[2px] rounded-md">
                        No sessions
                      </span>
                    )}
                  </button>
                ))}
              </div>
          </div>

          {/* Sessions + Packages */}
          {activeTab === "Indoor" && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-[#2A8ACE] mb-4">
                Indoor Sessions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {eventSessions
                  .filter((s) => s.sessionType === "Indoor")
                  .map((s) => (
                    <div
                      key={s.sessionId}
                      onClick={() => {
                        if (!s.available) return;
                        setSelectedSession(s.sessionId)}}
                      className={`rounded-xl p-4 text-center cursor-pointer transition ${
                        selectedSession === s.sessionId
                          ? "bg-[#2A8ACE] text-white"
                          : s.available
                          ? "bg-white shadow-md hover:shadow-lg"
                          : "bg-gray-200 text-gray-400 opacity-70 cursor-not-allowed"
                      }`}
                    >
                      <p className="text-sm font-medium">Slot {s.slotNumber}</p>
                      <p className="text-lg font-bold mt-2">
                        {s.startTime} - {s.endTime}
                      </p>
                      {/* 🚫 Unavailable Badge */}
                      {!s.available && (
                        <div className=" bg-red-200 text-gray-500 text-xs font-semibold px-2 py-1 rounded-md shadow">
                          Unavailable
                        </div>)}
                    </div>
                  ))}
              </div>

              <h2 className="text-xl font-semibold text-[#2A8ACE] mb-4">
                Indoor Packages
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {eventDetails?.indoorPackageInfo?.map((pkg, i) => (
                  <div
                    key={pkg.packageId}
                    onClick={() => setSelectedPackage(pkg.packageId)}
                    className={`rounded-xl p-4 cursor-pointer transition ${
                      selectedPackage === pkg.packageId
                        ? "bg-[#2A8ACE] text-white"
                        : pkg.color ||
                          (i === 0
                            ? "bg-red-500 text-white"
                            : i === 1
                            ? "bg-orange-500 text-white"
                            : "bg-blue-500 text-white"
                            )
                    }`}
                  >
                    <h3 className="text-lg font-bold">{pkg.packageName}</h3>
                    <p className="mt-2">Members: {pkg.numberOfMembers}</p>
                    <p>Photos: {pkg.photoCount}</p>
                    <p className="mt-2 font-semibold">Price: Rs.{pkg.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Outdoor" && (
            <div className="space-y-8">
              <h2 className="text-xl font-semibold text-[#2A8ACE] mb-4">
                Outdoor Sessions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {eventSessions
                  .filter((s) => s.sessionType === "Outdoor")
                  .map((s) => (
                    <div
                      key={s.sessionId}
                      onClick={() => {
                        if (!s.available) return;
                        setSelectedSession(s.sessionId)}}
                      className={`rounded-xl p-4 text-center cursor-pointer transition ${
                        selectedSession === s.sessionId
                          ? "bg-[#2A8ACE] text-white"
                          : s.available
                          ? "bg-white shadow-md hover:shadow-lg"
                          : "bg-gray-200 text-gray-400 opacity-70 cursor-not-allowed"
                      }`}
                    >
                      <p className="text-sm font-medium">Slot {s.slotNumber}</p>
                      <p className="text-lg font-bold mt-2">
                        {s.startTime} - {s.endTime}
                      </p>
                      {/* 🚫 Unavailable Badge */}
                      {!s.available && (
                        <div className=" bg-red-200 text-gray-500 text-xs font-semibold px-2 py-1 rounded-md shadow">
                          Unavailable
                        </div>)}
                    </div>
                  ))}
              </div>

              <h2 className="text-xl font-semibold text-[#2A8ACE] mb-4">
                Outdoor Packages
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {eventDetails?.outdoorPackageInfo?.map((pkg, i) => (
                  <div
                    key={pkg.packageId}
                    onClick={() => setSelectedPackage(pkg.packageId)}
                    className={`rounded-xl p-4 cursor-pointer transition ${
                      selectedPackage === pkg.packageId
                        ? "bg-[#2A8ACE] text-white"
                        : pkg.color ||
                          (i === 0
                            ? "bg-blue-600 text-white"
                            : i === 1
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white")
                    }`}
                  >
                    <h3 className="text-lg font-bold">{pkg.packageName}</h3>
                    <p className="mt-2">Members: {pkg.numberOfMembers}</p>
                    <p>Photos: {pkg.photoCount}</p>
                    <p className="mt-2 font-semibold">Price: Rs.{pkg.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ✅ File Upload Section */}
          <div className="mt-10 hidden">
            <label className="block mb-2 text-lg font-semibold text-[#2A8ACE]">
              Optional: Upload a reference file
            </label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected File: {selectedFile.name}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="w-full flex justify-end mt-6">
            <button
              onClick={handleBook}
              disabled={bookingStatus === "loading"} // ✅ disable click when loading
              className={`text-white bg-[#2A8ACE] px-6 py-2 rounded-xl shadow-md transition-all duration-300
                ${bookingStatus === "loading"
                  ? "opacity-50 cursor-not-allowed scale-95"
                  : "hover:bg-[#1E6DAF] hover:scale-105"}
              `}
            >
              {bookingStatus === "loading" ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
      
    </div>
    <Footer />
    </>
  );
}

export default BookingEvent;
