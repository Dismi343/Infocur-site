import React, {useState, useMemo, useEffect} from 'react';
import axios from "axios";

// TimeSlotsPage.jsx
// Single-file React component styled for Tailwind CSS.
// Make sure your project has Tailwind CSS and the `font-sora` family available (or replace with a different font).

export default function TimeSlotsPage() {
  const [view, setView] = useState('outdoor'); // 'indoor' or 'outdoor'
  const [filter, setFilter] = useState('all'); // all, available, booked, blocked
  const [expandedId, setExpandedId] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventSessions, setEventSessions] = useState({}); // Store sessions for each event
  const [isLoading, setIsLoading] = useState(true);
  const [bookings,setBookings]=useState([]);
  //=====================================================================================================
  //=====================================================================================================


  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch events first
      const res = await axios.get("api/events/search", {
        params: {
          searchText: '',
          page: 0,
          size: 10
        }
      });

      const eventList = res.data.data.dataList || [];
      setEvents(eventList);
      //console.log('events', eventList);

      // Fetch sessions for each event
      const sessionsData = {};
     const bookingsData = {};

      for (const event of eventList) {
        try {
          const sessionRes = await axios.get(`api/events/slots/${event.eventId}`, {
            params: {
              searchText: '',
              page: 0,
              size: 100
            },
            withCredentials:true
          });

          const bookingRes = await axios.get(`http://localhost:8081/api/bookings/searchAllByEvent/${event.eventId}`, {
            params: {
              searchText: '',
              page: 0,
              size: 100
            },
            withCredentials:true
          });

          const sessions = sessionRes.data.data || [];
          sessionsData[event.eventId] = sessions;
         console.log(`Sessions for ${event.eventName}:`, sessions);
          const bookings = bookingRes.data || [];
          bookingsData[event.eventId] = bookings;
          console.log(`Bookings for ${event.eventName}:`, bookings);


        } catch (sessionError) {
          console.error(`Error fetching sessions for event ${event.eventId}:`, sessionError);
          sessionsData[event.eventId] = [];
        }
      }

      setEventSessions(sessionsData);
      setBookings(bookingsData);
      //console.log('All event sessions:', sessionsData);

    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Filter sessions for a specific event based on view and filter
  const getFilteredSessionsForEvent = (eventId) => {
    const sessions = eventSessions[eventId] || [];
    return sessions.filter(session => {
      const sessionType = (session.sessionType || session.type || '').toLowerCase();
      const isAvailable = session.available === true || session.available === 'true';

      const bookingDetails = getBookingDetailsForSession(eventId,  session.id || session.sessionId || session.slotId || session.slotNumber);


      // Check if session type matches the current view
      const matchesView = sessionType === view;

      // Check if session matches the current filter
      let matchesFilter = true;
      if (filter === 'available' ) {
        matchesFilter = isAvailable;
      } else if (filter === 'booked' ) {
        matchesFilter = !isAvailable && bookingDetails;
      } else if (filter === 'blocked') {
        matchesFilter = !bookingDetails &&!isAvailable;
      }
      // 'all' filter shows everything

      return matchesView && matchesFilter;
    });
  };

  // Find booking details for a specific session
  const getBookingDetailsForSession = (eventId, sessionId) => {
    const eventBookings = bookings[eventId];
    if (!eventBookings || !eventBookings.data || !eventBookings.data.dataList) {
      return null;
    }

    // Find booking where session id matches
    const booking = eventBookings.data.dataList.find(booking => {
      const bookingSessionId = booking.sessionId?.id || booking.sessionId?.sessionId || booking.sessionId?._id;
      return bookingSessionId === sessionId;
    });

    return booking;
  };

  const formatSessionTime = (session) => {
    if (session.time) return session.time;
    if (session.startTime && session.endTime) {
      return `${session.startTime} - ${session.endTime}`;
    }
    return 'Time not available';
  };

  const getSessionStatus = (session) => {
    if (session.status === 'blocked') return 'blocked';
    const isAvailable = session.available === true || session.available === 'true';
    return isAvailable ? 'available' : 'booked';
  };

  const formatStatusPill = (session,event) => {
    const status = getSessionStatus(session);
    const bookingDetails = getBookingDetailsForSession(event.eventId,  session.id || session.sessionId || session.slotId || session.slotNumber);


    if (status === 'booked' && bookingDetails) return (
      <div className="w-full rounded-md bg-[#d43d3d] text-white py-1 text-xs text-center shadow-sm">Booked</div>
    );
    if (status === 'available' && !bookingDetails) return (
      <div className="w-full rounded-md bg-[#3dd34a] text-white py-1 text-xs text-center shadow-sm">Available</div>
    );
    if (status === 'blocked' || !bookingDetails) return (
      <div className="w-full rounded-md bg-gray-500 text-white py-1 text-xs text-center shadow-sm">Blocked</div>
    );
    return null;
  };

  const toggleExpand = (sessionId) => {
    setExpandedId(expandedId === sessionId ? null : sessionId);
  };

  const toggleBlockSession = async (eventId, sessionId) => {
    const sessions = eventSessions[eventId] || [];
    const sessionIndex = sessions.findIndex(s => {
      const id = s.sessionId || s.id;
      return id === sessionId;
    });

    if (sessionIndex === -1) {
      console.log(`Session ${sessionId} not found in event ${eventId}`);
      return;
    }

    const session = sessions[sessionIndex];
    const currentAvailable = session.available === true ;

    // When blocking: available = false
    // When unblocking: available = true
    const newAvailable = !currentAvailable;

    console.log(`Toggling session ${sessionId}: available ${currentAvailable} -> ${newAvailable}`);

    // Update only the specific session in the UI
    setEventSessions(prev => ({
      ...prev,
      [eventId]: prev[eventId].map((s, index) => {
        if (index === sessionIndex) {
          return {
            ...s,
            available: newAvailable
          };
        }
        return s; // Keep other sessions unchanged
      })
    }));
    setExpandedId(null);

      try {
        // Make API call to update only this specific session
        await axios.put(`http://localhost:8081/api/sessions/update-session/${sessionId}`,
            newAvailable,
            {
              headers: { "Content-Type": "application/json" },
              withCredentials:true
            },
            );

        console.log(`Session ${sessionId} ${newAvailable ? 'unblocked (available=true)' : 'blocked (available=false)'} successfully`);

      } catch (error) {
        console.error('Failed to update session availability:', error);

        // Revert only this specific session on error
        setEventSessions(prev => ({
          ...prev,
          [eventId]: prev[eventId].map((s, index) => {
            if (index === sessionIndex) {
              return {
                ...s,
                available: currentAvailable // revert to original state
              };
            }
            return s; // Keep other sessions unchanged
          })
        }));

        alert('Failed to update session. Please try again.');
      }

    }




  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#7895B2]">
        <div className="flex items-center justify-center py-16">
          <svg className="w-12 h-12 text-gray-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#7895B2] p-6 font-sora">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-semibold text-white">Time slots</h1>
        </div>

        {/* Global filters */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex items-center justify-center gap-6 mb-4">
            <button
              onClick={() => setView('indoor')}
              className={`px-10 py-3 rounded-full text-2xl font-semibold shadow-md transform active:scale-95 transition-all duration-200 ${
                view === 'indoor' ? 'bg-[#2A8ACE] text-white' : 'bg-[#708794] text-white'
              }`}
            >
              INDOOR
            </button>
            <button
              onClick={() => setView('outdoor')}
              className={`px-10 py-3 rounded-full text-2xl font-semibold shadow-md transform active:scale-95 transition-all duration-200 ${
                view === 'outdoor' ? 'bg-[#2A8ACE] text-white' : 'bg-[#708794] text-white'
              }`}
            >
              OUTDOOR
            </button>
          </div>

          <div className="flex gap-6 items-center justify-center text-[#2A8ACE] font-semibold">
            {['all','available','booked','blocked'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`uppercase text-sm ${filter === f ? 'text-[#2A8ACE]' : 'text-[#2A8ACE]/70'} hover:underline`}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Events and their sessions */}
        {events.length === 0 ? (
          <div className="text-center text-white text-xl">No events found.</div>
        ) : (
          events.map((event) => {
            const filteredSessions = getFilteredSessionsForEvent(event.eventId);

            return (
              <div key={event.eventId} className="bg-[#BFBFBF] rounded-2xl p-6 shadow-inner mb-6">
                <h2 className="text-3xl text-center text-white font-bold mb-2">{event.eventName}</h2>
                <p className="text-center text-white mb-6">{event.date}</p>

                <div className="bg-[#E6E6E6] rounded-xl p-8">
                  {filteredSessions.length === 0 ? (
                    <div className="text-center text-[#678aa0] font-semibold py-12">
                      No {view} sessions found for this event with filter: {filter}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-6">
                      {filteredSessions.map(session => {
                        const sessionId = session.id || session.sessionId || session.slotId || session.slotNumber;
                        const bookingDetails = getBookingDetailsForSession(event.eventId, sessionId);
                        const status = getSessionStatus(session);

                        return (
                          <div key={sessionId} className="bg-[#2A8ACE] rounded-md p-5 shadow-lg relative">
                            <div className="text-white text-sm font-bold text-center mb-3">
                              {formatSessionTime(session)}
                            </div>
                            <div className="text-white text-xs text-center mb-3">
                              Slot #{session.slotNumber || sessionId}
                            </div>

                            <div className="mb-3">{formatStatusPill(session,event)}</div>

                            <div className="flex justify-center gap-3">
                              {status === 'booked' && bookingDetails && (
                                <button
                                  onClick={() => toggleExpand(sessionId)}
                                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded shadow-sm text-sm"
                                >
                                  Details
                                </button>
                              )}
                              {status === 'available'&& !bookingDetails && (
                                <button
                                  onClick={() => toggleBlockSession(event.eventId, sessionId)}
                                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded shadow-sm text-sm"
                                >
                                  Block
                                </button>
                              )}
                              { status==='booked' &&!bookingDetails && (
                                <button
                                  onClick={() => toggleBlockSession(event.eventId, sessionId)}
                                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded shadow-sm text-sm"
                                >
                                  Unblock
                                </button>
                              )}
                            </div>

                            {expandedId === sessionId && status === 'booked' && (
                              <div className="absolute top-24 left-4 right-4 bg-white rounded-md p-3 mt-2 text-sm shadow-lg z-10">
                                <div className="font-semibold text-[#2A8ACE] mb-2">Booking Details</div>
                                {(() => {
                                  const bookingDetails = getBookingDetailsForSession(event.eventId, sessionId);
                                  if (bookingDetails) {
                                    return (
                                      <>
                                        <div className="mb-1"><span className="font-semibold">Client Name:</span> {bookingDetails.clientId?.fullName || 'N/A'}</div>
                                        <div className="mb-1"><span className="font-semibold">Contact:</span> {bookingDetails.clientId?.mnumber || bookingDetails.clientId?.contactNumber || 'N/A'}</div>
                                        <div className="mb-1"><span className="font-semibold">Email:</span> {bookingDetails.clientId?.email || 'N/A'}</div>
                                        <div className="mb-1"><span className="font-semibold">Package:</span> {bookingDetails.packageId.packageName|| 'N/A'}</div>
                                        <div className="mb-1"><span className="font-semibold">Reg Number:</span> {bookingDetails.clientId?.regNumber || 'N/A'}</div>
                                        <div className="mb-1"><span className="font-semibold">Booking Status:</span> {bookingDetails.status || 'N/A'}</div>
                                        <div className="mb-1"><span className="font-semibold">Event:</span> {event.eventName}</div>
                                        <div className="mb-1"><span className="font-semibold">Type:</span> {session.sessionType || 'N/A'}</div>
                                        <div className="mb-1"><span className="font-semibold">Slot:</span> #{session.slotNumber || 'N/A'}</div>
                                        <div className="mb-1"><span className="font-semibold">Time:</span> {formatSessionTime(session)}</div>
                                      </>
                                    );
                                  } else {
                                    return (
                                      <>
                                        <div className="mb-1 text-gray-500">Booking details not found</div>
                                        <div className="mb-1"><span className="font-semibold">Event:</span> {event.eventName}</div>
                                        <div className="mb-1"><span className="font-semibold">Type:</span> {session.sessionType || 'N/A'}</div>
                                        <div className="mb-1"><span className="font-semibold">Slot:</span> #{session.slotNumber || 'N/A'}</div>
                                        <div className="mb-1"><span className="font-semibold">Time:</span> {formatSessionTime(session)}</div>
                                      </>
                                    );
                                  }
                                })()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
