import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { X, UploadCloud } from "lucide-react";
import Footer from "../components/Footer2";

function UploadSlip() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const booking = state?.booking;
  const packageId = state?.packageId;
  const sessionId = state?.sessionId;

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        await axios.get("/api/clients/profile", { withCredentials: true });
      } catch (e) {
        console.error("Error fetching client data:", e);
        navigate("/account");
      }
    };
    fetchClient();
  }, [navigate]);

  if (!booking) {
    return <p className="p-10 text-red-500">No booking selected</p>;
  }

  const validateFile = (selectedFile) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Only image files (JPG, PNG, etc.) are allowed.");
      return false;
    }
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2 MB. Please select a smaller image.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) {
      e.target.value = ""; // reset file input
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (!validateFile(droppedFile)) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }

    setFile(droppedFile);
    setPreviewUrl(URL.createObjectURL(droppedFile));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const dto = {
        sessionId: sessionId,
        packageId: packageId,
      };
      formData.append("data", new Blob([JSON.stringify(dto)], { type: "application/json" }));

      await axios.put(`/api/bookings/update/${booking.bookingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Slip uploaded successfully!");
      setFile(null);
      setPreviewUrl(null);
      setTimeout(() => {
      navigate("/your-bookings");
      },1000)

    } catch (error) {
      console.error("Error uploading slip:", error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="bg-[#788DA2]  flex items-center justify-center">
        <div className="bg-white mt-30 mb-10 rounded-2xl p-6 md:p-10 w-[90%] max-w-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Payment Slip</h2>

          <div className="text-gray-700 mb-4 space-y-1">
            <p>
              <strong>Event:</strong> {booking.eventName}
            </p>
            <p>
              <strong>Package:</strong> {booking.packageName} - Rs.{booking.price}
            </p>
            <p>
              <strong>Date:</strong> {booking.eventDate}
            </p>
          </div>

          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-3 rounded-md mb-5 text-sm font-semibold">
            ⚠️ Please note: Only one slip can be uploaded. Reuploads are not allowed.
          </div>

          {/* Modern Drag & Drop Zone */}
          {!previewUrl ? (
            <div
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById("fileInput").click()}
            >
              <UploadCloud className="mx-auto text-blue-500 mb-2" size={36} />
              <p className="text-gray-700 font-medium">Drag & drop or click to upload</p>
              <p className="text-xs text-gray-500 mt-1">Max size: 2 MB (JPG, PNG, WebP)</p>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="rounded-xl border border-gray-200 shadow-md max-h-72 w-full object-contain"
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="mt-6 w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload Slip"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UploadSlip;
