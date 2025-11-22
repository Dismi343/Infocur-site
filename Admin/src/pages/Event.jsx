import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Event = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [error, setError] = useState(false);

  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [selectedEventForDelete, setSelectedEventForDelete] = useState(null);
  const [selectedEventForEdit, setSelectedEventForEdit] = useState(null);

  //Added - state for dropdown toggle
  const [expandedEventId, setExpandedEventId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("api/events/search", {
        params: {
          searchText: '',
          page: 0,
          size: 10
        }
      });
      console.log('Fetched Events:', res.data.data.dataList);
      const eventList = Array.isArray(res.data.data.dataList) ? res.data.data.dataList : [];

      // Process each event to separate indoor and outdoor packages
      const processedEvents = eventList.map(event => ({
        ...event,
        indoorPackages: event.indoorPackageInfo || [],
        outdoorPackages: event.outdoorPackageInfo || []
      }));

      setEvents(processedEvents);
      console.log('Processed Events with packages:', processedEvents);

    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setShowModal(true);
    setEventName('');
    setError(false);
  };

  const handleModalSubmit = () => {
    if (eventName.trim() === '') {
      setError(true);
    } else {
      setError(false);
      console.log('Event Created:', eventName);
      setShowModal(false);
      navigate('/event-creation', { state: { eventName: eventName } });
    }
  };

  const deleteEvent = async (id) => {
    try {
      const res = await axios.delete(`api/events/delete/${id}`,{withCredentials:true});
      console.log('Event deleted:', res.data);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const confirmDelete = (event) => {
    setSelectedEventForDelete(event);
    setShowDeleteConfirm(true);
  };

  const confirmEdit =(event)=>{
    setSelectedEventForEdit(event);
    setShowEditConfirm(true);
  }

  const handleConfirmDelete = async () => {
    if (!selectedEventForDelete) return;
    const id = selectedEventForDelete.eventId ?? selectedEventForDelete.id;
    await deleteEvent(id);
    setShowDeleteConfirm(false);
    setSelectedEventForDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedEventForDelete(null);
  };

  const handleCancelEdit = () => {
    setShowEditConfirm(false);
  };

  const handleConfirmEdit =()=>{
    if (!selectedEventForEdit) return;
    const eventId = selectedEventForEdit.eventId ?? selectedEventForEdit.id;
    editEvent(eventId);
    setShowEditConfirm(false);
    console.log(eventId);
  }


  // ---- CHANGE: Updated editEvent function to redirect to EventEdit page ----
  const editEvent = (eventId) => {
    navigate(`/event-edit/${eventId}`); // pass eventId via state
    console.log('Edit Event ID:', eventId);
  };

  //Added function to toggle dropdown
  const toggleDropdown = (eventId) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  return (
    <div className="relative min-h-screen bg-[#7895B2] px-4 py-8 font-sora">

      {/* Create Event Card */}
      <div className="flex mx-auto bg-[#D9D9D9] items-center rounded-2xl p-6 mb-6 shadow-lg">
        <div className="w-[70%]">
          <h2 className="text-2xl font-bold text-[#2A8ACE] mb-4">MAKE NEW EVENT</h2>
        </div>
        <div className="w-[30%] flex justify-end">
          <button
            onClick={handleCreateEvent}
            className="bg-[#2A8ACE] text-white px-6 py-2 rounded shadow hover:bg-blue-600 mr-10"
          >
            New Event
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-xl animate-fade-in">
            <h2 className="text-2xl font-semibold text-[#333] mb-4">Create New Event</h2>

            <input
              type="text"
              value={eventName}
              onChange={(e) => {
                setEventName(e.target.value);
                if (error) setError(false);
              }}
              placeholder={error ? "Please enter a name" : "Enter event name"}
              className={`w-full px-4 py-2 border rounded-md mb-1 focus:outline-none transition-all duration-300 
                ${error ? 'border-red-300 placeholder-red-500 animate-shake focus:ring-2 focus:ring-red-300' : 'border-gray-300 focus:ring-2 focus:ring-blue-400'}`}
            />

            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleModalSubmit}
                className="bg-[#2A8ACE] text-white px-4 py-2 rounded hover:bg-[#2A8ACE]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Do you want to delete the event?</h3>
            {selectedEventForDelete && (
              <p className="text-sm text-gray-600 mb-4">{selectedEventForDelete.eventName || selectedEventForDelete.name}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                No
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit confirmation modal */}
      {showEditConfirm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg">
              <h3 className="text-red-500 mb-2 text-lg">Warning</h3>
              <h4 className="text-md  mb-4">Please note that editing the event may cause the deletion of paid or non paid bookings</h4>
              <h3 className="text-lg font-semibold mb-4">Do you want to edit the event?</h3>

              {selectedEventForDelete && (
                  <p className="text-sm text-gray-600 mb-4">{selectedEventForDelete.eventName || selectedEventForDelete.name}</p>
              )}
              <div className="flex justify-end gap-3">
                <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  No
                </button>
                <button
                    onClick={handleConfirmEdit}
                    className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <svg className="w-12 h-12 text-gray-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-700 py-8">No events found.</div>
      ) : (
        events.map((event, index) => (
          <div key={index} className="mx-auto bg-[#D9D9D9] rounded-2xl p-6 mb-6 shadow-lg">

            {/* Event header */}
            <div className="flex items-center">
              <div className="mt-4 mb-4 w-[70%]">
                <h2 className="text-4xl font-bold text-[#2A8ACE] mb-3">{event.eventName}</h2>
                <h3 className="text-xl font-bold text-[#2A8ACE]">{event.date}</h3>
              </div>

              <div className="w-[30%] flex justify-end">
                {/* ---- CHANGE: Edit button now redirects to EventEdit page ---- */}
                <button
                  onClick={() =>{confirmEdit(event)}}
                  className="bg-[#2A8ACE] text-white px-6 py-2 rounded shadow hover:bg-blue-600 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(event)}
                  className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600 mr-4"
                >
                  Delete
                </button>

                {/* Added dropdown toggle button */}
                <button
                  onClick={() => toggleDropdown(event.eventId)}
                  className="text-gray-700 hover:text-gray-900"
                >
                  {expandedEventId === event.eventId ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* Packages Dropdown */}
            {expandedEventId === event.eventId && (
              <div className="mt-4">
                <h3 className="text-center text-xl font-bold text-[#2A8ACE] mb-4">Packages</h3>
                <div className="flex gap-8">
                  {/* Outdoor Packages - left side */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-4 text-center">Outdoor Packages</h4>
                    <div className="flex gap-4 flex-wrap justify-center">
                      {event.outdoorPackages && event.outdoorPackages.length > 0 ? (
                        event.outdoorPackages.map((pkg, i) => (
                          <div
                            key={pkg.packageId || i}
                            className={`inline-flex flex-col p-3 rounded-lg shadow-md text-white min-w-[200px] ${
                              pkg.color || (i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : 'bg-yellow-500')
                            }`}
                          >
                            <span className="font-bold">{pkg.packageName} Package</span>
                            <span>Photo Count: {pkg.photoCount}</span>
                            <span>No of Members: {pkg.numberOfMembers}</span>
                            <span>Rate: LKR {pkg.price}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-600 text-center">No outdoor packages available</div>
                      )}
                    </div>
                  </div>

                  {/* Indoor Packages - right side */}
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-4 text-center">Indoor Packages</h4>
                    <div className="flex gap-4 flex-wrap justify-center">
                      {event.indoorPackages && event.indoorPackages.length > 0 ? (
                        event.indoorPackages.map((pkg, i) => (
                          <div
                            key={pkg.packageId || i}
                            className={`inline-flex flex-col p-3 rounded-lg shadow-md text-white min-w-[200px] ${
                              pkg.color || (i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-green-500' : 'bg-purple-500')
                            }`}
                          >
                            <span className="font-bold">{pkg.packageName} Package</span>
                            <span>Photo Count: {pkg.photoCount}</span>
                            <span>No of Members: {pkg.numberOfMembers}</span>
                            <span>Rate: LKR {pkg.price}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-600 text-center">No indoor packages available</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        ))
      )}
    </div>
  );
};

export default Event;
