import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";

const ProgressPage = () => {
  const { eventId } = useParams();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingStates, setSavingStates] = useState({});
  const [localProgress, setLocalProgress] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("regNumber");

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setIsLoading(true);

    if (!eventId) {
      setBookings([]);
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.get(`/api/photo-progress/search-by-event/${eventId}`, {
        params: { searchText: '', page: 0, size: 10 },
        withCredentials: true
      });

      const progressList = Array.isArray(res.data.data.dataList) ? res.data.data.dataList : [];
      const filteredList = progressList.filter((booking) => booking.bookingId.status === "true");
      setBookings(filteredList);

      const initialProgress = {};
      filteredList.forEach(booking => {
        initialProgress[booking.id] = {
          shootComplete: booking.status === "shootComplete",
          editing: booking.status === "editing",
          completed: booking.status === "completed"
        };
      });
      setLocalProgress(initialProgress);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldUpdate = async (bookingId, field, value) => {
    const saveKey = `${bookingId}-${field}`;
    try {
      setSavingStates(prev => ({ ...prev, [saveKey]: true }));
      const body = {};

      if (field === "img_number") {
        const num = Number(value);
        body[field] = Number.isNaN(num) ? 0 : num;
      } else if (field === "d_link") {
        body.d_link = value ?? "";
      } else {
        body[field] = value;
      }

      await axios.put(
        `/api/photo-progress/update-fields/${bookingId}`,
        body,
        { withCredentials: true }
      );
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    } finally {
      setSavingStates(prev => {
        const newState = { ...prev };
        delete newState[saveKey];
        return newState;
      });
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...bookings];
    updated[index][field] = value;
    setBookings(updated);
  };

  const handleCheckbox = async (index, field) => {
    const booking = bookings[index];
    const progressId = booking.id;
    const saveKey = `${progressId}-${field}`;

    const currentLocal = localProgress[progressId] || { shootComplete: false, editing: false, completed: false };
    const newLocal = { ...currentLocal };

    if (field === 'shootComplete') {
      newLocal.shootComplete = !currentLocal.shootComplete;
      newLocal.editing = false;
      newLocal.completed = false;
    } else if (field === 'editing') {
      newLocal.editing = !currentLocal.editing;
      newLocal.shootComplete = false;
      newLocal.completed = false;
    } else if (field === 'completed') {
      newLocal.completed = !currentLocal.completed;
      newLocal.shootComplete = false;
      newLocal.editing = false;
    }

    setLocalProgress(prev => ({ ...prev, [progressId]: newLocal }));

    let newStatus = 'pending';
    if (newLocal.shootComplete) newStatus = 'shootComplete';
    else if (newLocal.editing) newStatus = 'editing';
    else if (newLocal.completed) newStatus = 'completed';

    try {
      setSavingStates(prev => ({ ...prev, [saveKey]: true }));
      await axios.put(
        `/api/photo-progress/update-status/${progressId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      const updated = [...bookings];
      updated[index] = { ...updated[index], status: newStatus };
      setBookings(updated);
    } catch (error) {
      console.error('Failed to update status:', error);
      setLocalProgress(prev => ({ ...prev, [progressId]: currentLocal }));
    } finally {
      setSavingStates(prev => {
        const newState = { ...prev };
        delete newState[saveKey];
        return newState;
      });
    }
  };

  const SavingIcon = () => (
    <svg className="w-4 h-4 animate-spin text-blue-500 inline ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );

  // 🔍 Filter bookings based on search input
  const filteredBookings = bookings.filter(b => {
    const value =
      searchField === "regNumber"
        ? b.clientId.regNumber?.toLowerCase()
        : b.clientId.fullName?.toLowerCase();

    return value.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="relative min-h-screen bg-[#7895B2] px-4 py-8 font-sora flex justify-center items-start">
      <div className="bg-[#D9D9D9] rounded-2xl shadow-lg p-8 w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#000000]">Shoot Progress</h2>

          {/* 🔍 Search bar with dropdown */}
          {/* 🔍 Modern Search bar with dropdown */}
            <div className="flex items-center space-x-2 bg-white rounded-full shadow-md px-3 py-1 border border-gray-200 focus-within:ring-2 focus-within:ring-[#2A8ACE] transition-all">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                className="outline-none bg-transparent text-gray-700 px-2 py-1 rounded-full cursor-pointer"
              >
                <option value="regNumber">Reg No</option>
                <option value="fullName">Name</option>
              </select>
              
              <div className="flex items-center flex-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder={`Search by ${searchField === "regNumber" ? "Reg No" : "Name"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                />
              </div>
        </div>
      </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="w-12 h-12 text-gray-700 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center text-gray-700 py-8">No photo progress found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-md">
              <thead className="bg-[#2A8ACE] text-white">
                <tr>
                  <th className="py-3 px-4 text-left rounded-tl-xl">No</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Reg No</th>
                  <th className="py-3 px-4 text-left">Contact No</th>
                  <th className="py-3 px-4 text-left">Event</th>
                  <th className="py-3 px-4 text-left">Time</th>
                  <th className="py-3 px-4 text-left">Image Numbers</th>
                  <th className="py-3 px-4 text-left">Shoot Complete</th>
                  <th className="py-3 px-4 text-left">Editing</th>
                  <th className="py-3 px-4 text-left">Completed</th>
                  <th className="py-3 px-4 text-left rounded-tr-xl">Link</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => {
                  const currentProgress = localProgress[booking.id] || { shootComplete: false, editing: false, completed: false };

                  return (
                    <tr key={booking.id} className="border-b hover:bg-gray-100 transition-all">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{booking.clientId.fullName}</td>
                      <td className="py-2 px-4">{booking.clientId.regNumber}</td>
                      <td className="py-2 px-4">{booking.clientId.mnumber}</td>
                      <td className="py-2 px-4">{booking.eventId.eventName}</td>
                      <td className="py-2 px-4">{booking.bookingId.session.startTime}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center">
                          <input
                            type="text"
                            placeholder="e.g. 1-50"
                            value={booking.img_number ?? ""}
                            onChange={(e) => handleChange(index, 'img_number', e.target.value)}
                            onBlur={(e) => handleFieldUpdate(booking.id, "img_number", e.target.value)}
                            className="w-full px-3 py-1 border rounded-lg"
                          />
                          {savingStates[`${booking.id}-img_number`] && <SavingIcon />}
                        </div>
                      </td>
                      <td className="py-2 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={currentProgress.shootComplete}
                          onChange={() => handleCheckbox(index, 'shootComplete')}
                          className="w-5 h-5 accent-[#2A8ACE]"
                        />
                        {savingStates[`${booking.id}-shootComplete`] && <SavingIcon />}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={currentProgress.editing}
                          onChange={() => handleCheckbox(index, 'editing')}
                          className="w-5 h-5 accent-[#2A8ACE]"
                        />
                        {savingStates[`${booking.id}-editing`] && <SavingIcon />}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={currentProgress.completed}
                          onChange={() => handleCheckbox(index, 'completed')}
                          className="w-5 h-5 accent-[#2A8ACE]"
                        />
                        {savingStates[`${booking.id}-completed`] && <SavingIcon />}
                      </td>
                      <td className="py-2 px-4">
                        <div className="flex items-center">
                          <input
                            type="url"
                            value={booking.d_link ?? ""}
                            onChange={(e) => handleChange(index, 'd_link', e.target.value)}
                            onBlur={(e) => handleFieldUpdate(booking.id, "d_link", e.target.value)}
                            className="w-full px-3 py-1 border rounded-lg text-blue-600 underline hover:cursor-pointer"
                            placeholder="Photo link"
                          />
                          {savingStates[`${booking.id}-d_link`] && <SavingIcon />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
