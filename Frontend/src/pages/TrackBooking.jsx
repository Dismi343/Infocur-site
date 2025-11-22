import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer2";
import { Link2, Camera, CalendarDays, Package, Loader2 } from "lucide-react";

function TrackBooking() {
  const { state } = useLocation();
  const booking = state?.booking;
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (booking?.bookingId) {
        try {
          const res = await axios.get(`/api/photo-progress/search-by-booking/${booking.bookingId}`);
          const progressList = res.data?.data?.dataList || [];
          if (progressList.length > 0) {
            setProgress(progressList[0]);
          }
        } catch (err) {
          console.error("Error fetching progress:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProgress();
  }, [booking]);

  if (!booking) {
    return <div className="flex justify-center items-center h-screen text-gray-500">No booking data found.</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "shootComplete":
        return "bg-yellow-500";
      case "editing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-600";
      default:
        return "bg-gray-400";
    }
  };

  /*const progressPercent = progress && booking.photoCount
    ? Math.min((progress.img_number / booking.photoCount) * 100, 100)
    : 0;*/

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#9bb2c8] to-[#55697f] flex flex-col items-center p-6">
        <div className="mt-24 w-full max-w-3xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-8 border border-white/30 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,0,0,0.1)]">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
            <Camera className="text-blue-600" /> Photo Progress Tracker
          </h1>

          {/* Booking Info */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
            <div><CalendarDays className="inline w-4 h-4 mr-1" /> <span className="font-medium">Event:</span> {booking.eventName}</div>
            <div><span className="font-medium">Date:</span> {booking.eventDate}</div>
            <div><Package className="inline w-4 h-4 mr-1" /> <span className="font-medium">Package:</span> {booking.packageName}</div>
            <div><span className="font-medium">Photo Count:</span> {booking.photoCount}</div>
            <div><span className="font-medium">Session Type:</span> {booking.sessionType}</div>
            <div>
              <span className="font-medium">Status:</span>
              {booking.status === "true" ? (
                <span className="ml-2 text-green-600 font-semibold">Confirmed</span>
              ) : (
                <span className="ml-2 text-red-600 font-semibold">
                  Pending Payment - Upload your bank slip
                </span>
              )}
            </div>
          </div>

          {/* Progress Section */}
          <div className="border-t border-gray-200 pt-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Progress Details</h2>

            {loading ? (
              <div className="flex justify-center items-center text-gray-500 py-6">
                <Loader2 className="animate-spin w-6 h-6 mr-2" /> Loading progress...
              </div>
            ) : progress ? (
              <div className="space-y-4 text-gray-700">
                <div>
                  <p>
                    <span className="font-medium">Progress Status:</span>
                    <span className={`ml-2 px-2 py-1 text-white text-xs rounded-full ${getStatusColor(progress.status)}`}>
                      {progress.status}
                    </span>
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                      className={`${getStatusColor(progress.status)} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `100%` }}
                    ></div>
                  </div>
                </div>
                { progress.d_link ? (
                
                <div >
                  {/* Google Drive Link */}
                  <p className="font-medium mb-2">Drive Link:</p>
                  <a
                    href={progress.d_link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-blue-600 font-medium hover:underline"
                  >
                    <Link2 className="w-4 h-4" /> Open in Google Drive
                  </a>

                  {/* Embedded Drive Preview */}
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                    <iframe
                      src={progress.d_link}
                      className="w-full h-64"
                      allow="autoplay"
                    ></iframe>
                  </div>
                </div>
                ):(
                  <div>
                    <p className="text-gray-500 py-4">No drive link uploaded yet.</p>
                    </div>
                ) }

              </div>
            ) : (
              <p className="text-gray-500 py-4">No progress data found yet.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default TrackBooking;
