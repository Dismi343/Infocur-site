import { useNavigate } from "react-router-dom";
import EventCard from "../components/EventCard";
import Footer2 from "../components/Footer2";
import axios from "axios";
import { useState, useEffect } from "react";


function BookingPage() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
   const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("api/events/search", {
        params: {
          searchText: "",
          page: 0,
          size: 10,
        },
      });
      console.log("Fetched Events:", res.data.data.dataList);
      const eventList = Array.isArray(res.data.data.dataList)
        ? res.data.data.dataList
        : [];
      setEvents(eventList);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    }finally {
      setLoading(false); 
    }
  };

  const handleClick = (eventId,eventName) => {
    navigate("/booking-instructions", { state: { eventId, eventName } });
  };

  return (
    <>
      {/* Loading Popup */}
      {(loading ? (
        <div className="flex items-center justify-center h-screen bg-[#2A8ACE]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-4 text-lg font-semibold">Loading...</p>
        </div>
      </div>
      ): (
      <div className="bg-[#788DA2] py-12 md:py-12">
        <div className="max-w-[95%] mx-auto justify-center">
          <div className="mt-10 md:py-12 font-sora font-semibold text-2xl md:text-4xl">
            <h1>Events</h1>
          </div>
          {events.map((event) => (
            <button
              key={event.eventId}
              onClick={() => handleClick(event.eventId,event.eventName)}
              className="w-full text-left"
            >
              <EventCard title={event.eventName} subtitle={event.date} />
            </button>
          ))}
        </div>
      </div>
      ))}
      <Footer2 />
    </>
  );
}

export default BookingPage;
