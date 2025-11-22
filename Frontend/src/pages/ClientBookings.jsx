import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer2";
import { useNavigate } from "react-router-dom";
import * as React from 'react';

function ClientBookings() {
  const [previewUrl, setPreviewUrl] = React.useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [bankDetailsLoading,setDLoading] = useState(false);
  const [photoProgress, setPhotoProgress] = useState({});


  const [bankDetails, setBankDetails] = useState([]);
  const [contactDetails, setcontDetails] = useState([]);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        setDLoading(true);
        const bankId ="dfc626f4-5ea3-4149-a7f4-26364e91dec3";
        const res = await axios.get(`/api/bankDetails/find/${bankId}`);
        setBankDetails(res.data.data); // assuming StandardResponse has a 'data' field
        
      } catch (error) {
        console.error("Error fetching bank details:", error);
      }
    };

    fetchBankDetails();
  }, []);


  useEffect(() => {
    const fetchContDetails = async () => {
      try {
        
        const contId ="21734a30-23a2-4561-b028-5470b6709156";
        const res = await axios.get(`/api/contactDetails/find/${contId}`);
        setcontDetails(res.data.data); // assuming StandardResponse has a 'data' field
        setDLoading(false);
      } catch (error) {
        console.error("Error fetching contact details:", error);
      }
    };

    fetchContDetails();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/bookings/searchAllByClient", {
        params: { searchText: "", page: 0, size: 100 },
        withCredentials: true,
      });

      console.log("Fetched bookings:", res.data.data);
      
      setBookings(res.data.data?.dataList || []);
      fetchPhotoProgress(res.data.data?.dataList || []);

    } catch (error) {
      console.error("Error fetching bookings:", error);
      navigate('/account?next=/your-bookings');
    } 
  };
  const fetchPhotoProgress = async (bookings) => {
      try {
        const progressMap = {};
        for (const b of bookings) {
          const res = await axios.get(`/api/photo-progress/search-by-booking/${b.bookingId}`, {
            params: { searchText: "", page: 0, size: 1 },
          });
          const progressList = res.data?.data?.dataList || [];
          if (progressList.length > 0) {
            progressMap[b.bookingId] = progressList[0].status;
          }
        }
        setPhotoProgress(progressMap);
      } catch (error) {
        console.error("Error fetching photo progress:", error);
      }
      finally {
      setLoading(false);
    }
    };


  // Helper to extract booking details safely
  const normalizeBooking = (b) => {
    const pkg = typeof b.packageId === "object" ? b.packageId : b;
    const session = typeof b.sessionId === "object" ? b.sessionId : b;
    const event =
      session?.eventId || b.eventId || { eventName: "Unknown Event" };

    return {
      bookingId: b.bookingId,
      packageId: typeof b.packageId === "object" ? b.packageId.packageId : b.packageId, // ✅ only ID
      sessionId: typeof b.sessionId === "object" ? b.sessionId.sessionId : b.sessionId,
      eventName: event.eventName,
      eventDate: event.date || b.date,
      packageName: pkg.packageName || b.packageName,
      photoCount: pkg.photoCount || b.photoCount,
      price: pkg.price || b.price,
      members: pkg.numberOfMembers || b.numberOfMembers,
      sessionType: session.sessionType || b.sessionType,
      slotNumber: session.slotNumber || b.slotNumber,
      startTime: session.startTime || b.startTime,
      endTime: session.endTime || b.endTime,
      slipUrl: b.slipUrl,
      status: b.status,
      slipFile: b.slipFile,
    };
  };

  const handleDownload = async(file)=>{
       try{
            

           // build image url (same as before)
           const imageUrl = `http://localhost:8081/api/bookings/images/${file}`;

           // open in-window preview instead of new tab
           setPreviewUrl(imageUrl);
           setIsPreviewLoading(true);
           setIsPreviewOpen(true);
       }
       catch(error){
           console.log(error);
       }
   }

  return (
    <>
      <div className="bg-[#788DA2]">
        <div className="max-w-[90%] mx-auto mt-20 py-10">
          <div className="bg-[#E5E5E5] bg-opacity-90 rounded-2xl p-6 md:p-10">
            <div className="md:py-6 py-3 font-sora font-semibold text-2xl md:text-4xl">
              <p>Your bookings</p>
            </div>
            {isPreviewOpen && (
                <div
                  onClick={() => {
                    setIsPreviewOpen(false);
                    setPreviewUrl(null);
                    setIsPreviewLoading(false);
                  }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    zIndex: 1400,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      maxWidth: '90%',
                      maxHeight: '90%',
                      background: '#fff',
                      borderRadius: 8,
                      padding: 8,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setIsPreviewOpen(false);
                          setPreviewUrl(null);
                          setIsPreviewLoading(false);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: 18,
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        minWidth: 300,
                      }}
                    >
                      {isPreviewLoading && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 12,
                          }}
                        >
                          <div
                            style={{
                              width: 64,
                              height: 64,
                              borderRadius: 32,
                              border: '6px solid #e0e0e0',
                              borderTop: '6px solid #2A8ACE',
                              animation: 'spin 1s linear infinite',
                            }}
                          />
                          <div style={{ color: '#333' }}>Loading image...</div>
                        </div>
                      )}

                      <img
                        src={previewUrl}
                        alt="Preview"
                        onLoad={() => setIsPreviewLoading(false)}
                        onError={() => setIsPreviewLoading(false)}
                        style={{
                          display: isPreviewLoading ? 'none' : 'block',
                          maxWidth: '100%',
                          maxHeight: '80vh',
                          borderRadius: 6,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

            {/*bank details*/}
            {(bankDetailsLoading ?(
                <div className="mt-5 rounded-xl flex items-center justify-center h-[300px] bg-[#2A8ACE]">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
                    </div>
                </div>

            ) : (
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="md:w-1/2 w-full mx-auto bg-gray-300 shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition">
                    <div className="flex items-center mb-3">
                        
                        <h2 className="text-lg font-semibold text-gray-800">Bank Details</h2>
                    </div>

                    <div className="space-y-2 text-gray-700 text-sm">
                        <p><span className="font-medium">Bank Name:</span> {bankDetails.bankName}</p>
                        <p><span className="font-medium">Branch:</span> {bankDetails.branch}</p>
                        <p><span className="font-medium">Account Name:</span> {bankDetails.accountHolderName}</p>
                        <p><span className="font-medium">Account Number:</span> {bankDetails.accountNumber}</p>
                        <p><span className="font-medium">Reference:</span> Use your <span className="font-semibold text-blue-700">University Registered Number & Event name</span> when depositing</p>
                    </div>

                    <div className="mt-4 bg-blue-50 text-blue-700 text-xs p-3 rounded-lg border border-blue-100">
                        Please upload your payment slip below once the transaction is completed.
                    </div>
                </div>

                <div className="md:w-1/2 w-full mx-auto bg-gray-300 shadow-md rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition">
                    <div className="flex items-center mb-3">
                        
                        <h2 className="text-lg font-semibold text-gray-800">Contact Details</h2>
                    </div>

                    <div className="space-y-2 text-gray-700 text-sm">
                        <p><span className="font-medium">Phone number 1:</span> {contactDetails.contact1}</p>
                        <p><span className="font-medium">Phone number 2:</span> {contactDetails.contact2}</p>
                        <p><span className="font-medium">Email :</span> {contactDetails.email}</p>
                    </div>

                    {/*<div className="mt-4 bg-blue-50 text-blue-700 text-xs p-3 rounded-lg border border-blue-100">
                        Please upload your payment slip below once the transaction is completed.
                    </div>*/}
                </div>

            </div>
            ))}
            {loading ? (
              <div className="mt-5 rounded-xl flex items-center justify-center h-[300px] bg-[#2A8ACE]">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
                    </div>
                </div>
            ) : bookings.length === 0 ? (
              <p className="text-gray-600">No bookings found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                {bookings.map((b) => {
                  const booking = normalizeBooking(b);
                  const progress = photoProgress[booking.bookingId] || "pending";
                  // Define colors based on progress
                    const progressColorMap = {
                     // pending: "bg-gray-100 border-gray-300",      // default / no progress
                      shootComplete: "bg-blue-100 border-blue-400",
                      editing: "bg-yellow-100 border-yellow-400",
                      completed: "bg-green-100 border-green-400",
                    };

                    const cardColor = progressColorMap[progress] || "bg-white border-gray-200";
                  
                  return (
                    <div
                        key={booking.bookingId}
                        className={`rounded-xl shadow-md p-5 flex flex-col gap-3 border transition 
                          ${cardColor}
                          ${booking.slipFile && booking.slipFile.split("-")[1] ? "opacity-90" : "hover:shadow-lg cursor-pointer"}
                        `}
    
                      onClick={() => {
                        // only allow navigation if slipFile has NO filename
                        const hasFile =
                           !!booking.slipFile.split("-")[1];
                        if (!hasFile) {
                          navigate("/upload-slip", {
                            state: { booking, packageId: booking.packageId, sessionId: booking.sessionId },
                          });
                        }
                        if(photoProgress[booking.bookingId] !=="pending"){
                          navigate("/track-booking", { state: { booking, progress: photoProgress[booking.bookingId] } });
                        }
                      }}
                    >
                      {/* Event */}
                      <h3 className="font-bold text-lg text-gray-800">
                        {booking.eventName}
                      </h3>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Date:</span>{" "}
                        {booking.eventDate}
                      </p>

                      {/* Session */}
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Session:</span>{" "}
                        {booking.sessionType || "N/A"} (Slot{" "}
                        {booking.slotNumber || "-"})
                      </p>
                      <p className="text-sm text-gray-700">
                        {booking.startTime} - {booking.endTime}
                      </p>

                      {/* Package */}
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Package:</span>{" "}
                        {booking.packageName} ({booking.photoCount} photos)
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Members:</span>{" "}
                        {booking.members}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Price:</span> Rs.{" "}
                        {booking.price}
                      </p>

                      {/* Status */}
                              <p
                                className={`text-sm font-semibold ${
                                  booking.status === "true"
                                    ? "text-green-600"
                                    : booking.slipFile.split("-")[1]
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {booking.status === "true"
                                  ? "Confirmed"
                                  : booking.slipFile.split("-")[1]
                                  ? "Pending Payment Approval"
                                  : "Pending Payment - Please pay the amount to the bank and upload the slip (click here) "}
                              </p>
                      {photoProgress[booking.bookingId] !=="pending" && (
                        <p
                          className={`text-sm font-semibold ${
                            photoProgress[booking.bookingId] === "completed"
                              ? "text-green-600"
                              : photoProgress[booking.bookingId] === "editing"
                              ? "text-yellow-600"
                              : "text-blue-600"
                          } cursor-pointer underline`}
                          onClick={(e) => {
                            e.stopPropagation(); // prevent triggering upload redirect
                            navigate("/track-booking", { state: { booking} });
                          }}
                        >
                          Click here to view Photo Progress : {photoProgress[booking.bookingId]}
                        </p>
                      )}
                      
                      {/* view slip */}
                        
                          <div className="flex justify-between items-center">
                           
                            {booking.slipFile && booking.slipFile.split("-")[1] && (
                              <button
                                onClick={() => handleDownload(booking.slipFile)}
                                className="text-blue-600 text-sm underline hover:text-blue-800"
                              >
                                View Slip
                              </button>
                            )}
                          </div>
                         
                        
                      

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ClientBookings;
