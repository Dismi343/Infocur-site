import React, { useState, useEffect } from "react";
import { useNavigate, useParams} from "react-router-dom";
import axios from "axios";

const colorOptions = [
  { name: 'Red', value: 'bg-red-600' },
  { name: 'Orange', value: 'bg-orange-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Blue', value: 'bg-blue-600' },
];

const EventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [indoor, setIndoor] = useState(false);
  const [outdoor, setOutdoor] = useState(false);
  const [startTime, setStartTime] = useState("08:00");

  // Indoor time slot states
  const [indoorTimeSlotDuration, setIndoorTimeSlotDuration] = useState(0);
  const [indoorInterval, setIndoorInterval] = useState(5);
  const [indoorMaxSlots, setIndoorMaxSlots] = useState(1);

  // Outdoor time slot states
  const [outdoorTimeSlotDuration, setOutdoorTimeSlotDuration] = useState(0);
  const [outdoorInterval, setOutdoorInterval] = useState(5);
  const [outdoorMaxSlots, setOutdoorMaxSlots] = useState(1);

  // Packages
  const [outdoorPackages, setOutdoorPackages] = useState([]);
  const [indoorPackages, setIndoorPackages] = useState([]);

  // Package ID arrays
  const [indoorPackageIds, setIndoorPackageIds] = useState([]);
  const [outdoorPackageIds, setOutdoorPackageIds] = useState([]);

  const [selectedArea, setSelectedArea] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPackage, setCurrentPackage] = useState({
    packageName: '',
    photoCount: '',
    price: '',
    numberOfMembers: '',
    color: 'bg-red-600',
  });

  const [loading, setLoading] = useState(false);

// form Data ==========================================================================================
//   const [formData, setFormData] = useState({
//     eventName:'',
//     date:'',
//     startTime:'',
//     indoorPackageInfo: [],
//     outdoorPackageInfo: [],
//     indoor:{
//       sessionDuration:'',
//       sessionCount:''
//     },
//     outdoor:{
//       sessionDuration:'',
//       sessionCount:''
//     }
//   });

  //==================================================================================================================

  useEffect(() => {
    if (id) fetchEventData();
  }, [id]);

  // Console log package ID arrays whenever they change
  useEffect(() => {
    console.log("Indoor Package IDs:", indoorPackageIds);
  }, [indoorPackageIds]);

  useEffect(() => {
    console.log("Outdoor Package IDs:", outdoorPackageIds);
  }, [outdoorPackageIds]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/events/find/${id}`,{withCredentials:true});
      const data = res.data.data;
      console.log(data);
      console.log(id);

        if(data.indoor.sessionCount!==0){
          setIndoor(true);
        }
        if(data.outdoor.sessionCount!==0){
          setOutdoor(true);
        }

      setEventName(data.eventName);
      setEventDate(data.date);

      setIndoorTimeSlotDuration(data.indoor.sessionDuration );
      setIndoorInterval(data.indoor.interval );
      setStartTime(data.startTime );
      setIndoorMaxSlots(data.indoor.sessionCount);

      setOutdoorTimeSlotDuration(data.outdoor.sessionDuration);
      setOutdoorInterval(data.outdoor.interval);
      setStartTime(data.startTime);
      setOutdoorMaxSlots(data.outdoor.sessionCount);

      setOutdoorPackages(data.outdoorPackageInfo );
      setIndoorPackages(data.indoorPackageInfo);

      // Extract package IDs
      const indoorIds = data.indoorPackageInfo ? data.indoorPackageInfo.map(pkg => pkg.packageId) : [];
      const outdoorIds = data.outdoorPackageInfo ? data.outdoorPackageInfo.map(pkg => pkg.packageId) : [];
      setIndoorPackageIds(indoorIds);
      setOutdoorPackageIds(outdoorIds);

    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };


  //------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------

// add near your useState declarations
  const toggleIndoor = () => {
    setIndoor(prev => {
      const newVal = !prev;
      if (!newVal) {
        setIndoorMaxSlots(0); // turned off -> 0
      } else if (indoorMaxSlots === 0) {
        setIndoorMaxSlots(1); // enable -> restore minimum 1 if it was 0
      }
      return newVal;
    });
  };

  const toggleOutdoor = () => {
    setOutdoor(prev => {
      const newVal = !prev;
      if (!newVal) {
        setOutdoorMaxSlots(0);
      } else if (outdoorMaxSlots === 0) {
        setOutdoorMaxSlots(1);
      }
      return newVal;
    });
  };


  //------------------------------------------------------------------------------------
  //------------------------------------------------------------------------------------



  const handleSave = async () => {

    const formattedDate = eventDate
        ? new Date(eventDate).toISOString().split('T')[0]
        : '';

    const newFormData={
      eventName:eventName,
      date:formattedDate,
      startTime: startTime + (startTime.length === 5 ? ":00" : ""),
      indoorPackageInfo: indoorPackageIds,
      outdoorPackageInfo: outdoorPackageIds,
      indoor:{
        sessionDuration:indoorTimeSlotDuration,
        interval:indoorInterval,
        sessionCount:indoorMaxSlots
      },
      outdoor:{
        sessionDuration:outdoorTimeSlotDuration,
        interval:outdoorInterval,
        sessionCount:outdoorMaxSlots
      }
    }

    console.log('formData',newFormData);
    console.log('Indoor Package IDs being sent:', indoorPackageIds);
    console.log('Outdoor Package IDs being sent:', outdoorPackageIds);

    try {
      console.log("event id",id);
      await axios.put(`http://localhost:8081/api/events/update/${id}`, newFormData,{
        withCredentials:true
      });
      alert("Event updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event.");
    }
  };

  // ---- PACKAGE MODAL FUNCTIONS ----
  const handleAddNewPackage = (type) => {
    setSelectedArea(type);
    setCurrentPackage({
      packageName: '',
      photoCount: '',
      price: '',
      numberOfMembers: '',
      color: 'bg-red-600',
    });
    setEditingIndex(null);
  };

  const handleEditPackage = (type, index) => {
    setSelectedArea(type);
    const packages = type === 'outdoor' ? outdoorPackages : indoorPackages;
    setCurrentPackage(packages[index]);
    setEditingIndex(index);
  };

  const handlePackageSave = async () => {
    try {
      let savedPackage;

      if (editingIndex !== null) {
        // Update existing package
        const packages = selectedArea === 'outdoor' ? outdoorPackages : indoorPackages;
        const pkg = packages[editingIndex];
        const response = await axios.put(`/api/packages/update/${pkg.packageId}`, currentPackage,{
          withCredentials:true
        });
        savedPackage = response.data;
      } else {
        // Create new package
        const response = await axios.post("/api/packages/create", currentPackage,{
          withCredentials:true
        });
        savedPackage = response.data;
      }

      // Update packages arrays
      if (selectedArea === 'outdoor') {
        const updated = [...outdoorPackages];
        if (editingIndex !== null) {
          updated[editingIndex] = savedPackage;
        } else {
          updated.push(savedPackage);
        }
        setOutdoorPackages(updated);

        // Update package IDs array
        const updatedIds = [...outdoorPackageIds];
        if (editingIndex !== null) {
          updatedIds[editingIndex] = savedPackage.packageId;
        } else {
          updatedIds.push(savedPackage.packageId);
        }
        setOutdoorPackageIds(updatedIds);
      } else {
        const updated = [...indoorPackages];
        if (editingIndex !== null) {
          updated[editingIndex] = savedPackage;
        } else {
          updated.push(savedPackage);
        }
        setIndoorPackages(updated);

        // Update package IDs array
        const updatedIds = [...indoorPackageIds];
        if (editingIndex !== null) {
          updatedIds[editingIndex] = savedPackage.packageId;
        } else {
          updatedIds.push(savedPackage.packageId);
        }
        setIndoorPackageIds(updatedIds);
      }

      setSelectedArea(null);
      setEditingIndex(null);
    } catch (error) {
      console.error("Error saving package:", error);
      alert("Failed to save package.");
    }
  };

  const handleDeletePackage = async (type, index) => {
    try {
      const packages = type === 'outdoor' ? outdoorPackages : indoorPackages;
      const pkg = packages[index];

      // Delete from backend
      await axios.delete(`/api/packages/delete/${pkg.packageId}`,{ withCredentials:true});

      // Update packages arrays
      if (type === 'outdoor') {
        setOutdoorPackages(outdoorPackages.filter((_, i) => i !== index));
        setOutdoorPackageIds(outdoorPackageIds.filter((_, i) => i !== index));
      } else {
        setIndoorPackages(indoorPackages.filter((_, i) => i !== index));
        setIndoorPackageIds(indoorPackageIds.filter((_, i) => i !== index));
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Failed to delete package.");
    }
  };

  if (loading)
    return <div className="text-center py-10 text-gray-600 font-sora">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#7895B2] font-sora px-4 py-8">
      <div className="max-w-6xl mx-auto bg-[#D9D9D9] rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-2xl mr-4 text-[#2A8ACE] hover:text-blue-600"
          >
            ←
          </button>
          <h2 className="text-2xl font-bold text-[#2A8ACE]">Event</h2>
        </div>

        <h3 className="text-center text-2xl font-bold mb-6">EDIT</h3>

        {/* Name & Date */}
        <div className="bg-[#D9D9D9] p-4 rounded-lg mb-8">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-1">Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Current Name"
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Date</label>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        {/* Indoor / Outdoor Time Slot Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 bg-[#CFCFCF] p-6 rounded-lg">
          {/* Indoor */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-lg">INDOOR</span>
              {/* Modern toggle */}
              <div
                onClick={() => toggleIndoor()}
                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                  indoor ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                    indoor ? "translate-x-7" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
            <div
              className={`bg-white p-4 rounded-lg border border-gray-300 transition-opacity duration-500 ${
                indoor ? "opacity-100" : "opacity-30 pointer-events-none"
              }`}
            >
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Time Slot Duration</label>
                <select
                  className="w-full border p-2 rounded-md"
                  value={indoorTimeSlotDuration}
                  onChange={(e) => setIndoorTimeSlotDuration(e.target.value)}
                >
                  <option value={20}>20 min</option>
                  <option value={30}>30 min</option>
                  <option value={40}>40 min</option>
                  <option value={50}>50 min</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Interval</label>
                <select
                  className="w-full border p-2 rounded-md"
                  value={indoorInterval}
                  onChange={(e) => setIndoorInterval(e.target.value)}
                >
                  <option>0</option>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                </select>
              </div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Starting Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border p-2 rounded-md"
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">No of Time Slots (Max)</label>
                <input
                  type="number"
                  min="1"
                  value={indoorMaxSlots}
                  onChange={(e) => setIndoorMaxSlots(e.target.value)}
                  className="border p-2 rounded-md w-24"
                />
              </div>
            </div>
          </div>

          {/* Outdoor */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold text-lg">OUTDOOR</span>
              {/* Modern toggle */}
              <div
                onClick={() => toggleOutdoor()}
                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                  outdoor ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                    outdoor ? "translate-x-7" : "translate-x-0"
                  }`}
                ></div>
              </div>
            </div>
            <div
              className={`bg-white p-4 rounded-lg border border-gray-300 transition-opacity duration-500 ${
                outdoor ? "opacity-100" : "opacity-30 pointer-events-none"
              }`}
            >
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Time Slot Duration</label>
                <select
                  className="w-full border p-2 rounded-md"
                  value={outdoorTimeSlotDuration}
                  onChange={(e) => setOutdoorTimeSlotDuration(e.target.value)}
                >
                  <option value={20}>20 min</option>
                  <option value={30}>30 min</option>
                  <option value={40}>40 min</option>
                  <option value={50}>50 min</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Interval</label>
                <select
                  className="w-full border p-2 rounded-md"
                  value={outdoorInterval}
                  onChange={(e) => setOutdoorInterval(e.target.value)}
                >
                  <option>0</option>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                </select>
              </div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Starting Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border p-2 rounded-md"
                />
              </div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">No of Time Slots (Max)</label>
                <input
                  type="number"
                  min="1"
                  value={outdoorMaxSlots}
                  onChange={(e) => setOutdoorMaxSlots(e.target.value)}
                  className="border p-2 rounded-md w-24"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PACKAGE SECTIONS */}
        {['outdoor', 'indoor'].map((type) => {
          const packages = type === 'outdoor' ? outdoorPackages : indoorPackages;
          return (
            <div key={type} className="mb-10">
              <h4 className="text-center text-xl font-bold text-[#2A8ACE] mb-3 capitalize">
                {type} Packages
              </h4>
              <div className="flex justify-center mb-4">
                <button
                  onClick={() => handleAddNewPackage(type)}
                  className={`bg-[#2A8ACE] text-white px-4 py-2 rounded shadow hover:bg-blue-600 ${
                      (type === 'indoor' && !indoor) || (type === 'outdoor' && !outdoor) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={(type === 'indoor' && !indoor) || (type === 'outdoor' && !outdoor)}
                >
                  Add New Package
                </button>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {packages.map((pkg, i) => (
                  <div
                    key={i}
                    className={`text-white rounded-lg p-4 w-48 text-center ${pkg.color || 'bg-red-600'}`}
                  >
                    <h4 className="font-bold">{pkg.packageName}</h4>
                    <p>Photo Limit: {pkg.photoCount}</p>
                    <p>No of Members: {pkg.numberOfMembers}</p>
                    <p>Rate: LKR {pkg.price}</p>
                    <div className="flex gap-2 mt-2 justify-center">
                      <button
                        onClick={() => handleEditPackage(type, i)}
                        className="bg-gray-200 text-gray-800 px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePackage(type, i)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Save Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>

      {/* PACKAGE MODAL */}
      {selectedArea && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-gray-300 p-6 rounded-lg w-full max-w-sm shadow-xl text-black">
            <h2 className="text-xl font-bold mb-4">
              {editingIndex !== null ? 'Edit Package' : 'New Package'}
            </h2>

            {['packageName', 'photoCount', 'numberOfMembers', 'price'].map((field, idx) => (
              <div key={idx} className="mb-3">
                <label className="block text-sm mb-1">
                  {field === 'packageName'
                    ? 'Package Name'
                    : field === 'photoCount'
                    ? 'Photo Limit'
                    : field === 'numberOfMembers'
                    ? 'No of Members'
                    : 'Rate'}
                </label>
                <input
                  type="text"
                  value={currentPackage[field]}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const newVal = ['photoCount','numberOfMembers','price'].includes(field)
                        ? raw.replace(/\D/g, '')
                        : raw;
                    setCurrentPackage({ ...currentPackage, [field]: newVal });
                  }}
                  placeholder={
                    field === 'packageName'
                      ? 'Package Name'
                      : field === 'photoCount'
                      ? 'Photo Limit'
                      : field === 'numberOfMembers'
                      ? 'No of Members'
                      : 'Rate'
                  }
                  className="w-full px-4 py-2 rounded-full text-black"
                />
              </div>
            ))}

            {/* Color Picker */}
            <div className="mb-4">
              <label className="block text-sm mb-1">Color</label>
              <div className="flex gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`w-6 h-6 rounded-full border-2 ${
                      currentPackage.color === opt.value ? 'border-white' : 'border-transparent'
                    } ${opt.value}`}
                    onClick={() => setCurrentPackage({ ...currentPackage, color: opt.value })}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={handlePackageSave}
                className="bg-[#2A8ACE] text-white px-7 py-2 rounded hover:bg-green-700"
              >
                {editingIndex !== null ? 'Save' : 'Add'}
              </button>
              <button
                onClick={() => setSelectedArea(null)}
                className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventEdit;
