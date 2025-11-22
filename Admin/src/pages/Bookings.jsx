import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";


function Bookings() {

    const [events, setEvents] = useState([]);
    const navigate = useNavigate();
    const [bookingCounts,setBookingCounts]=useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);
    // Replace with your backend endpoint
    const fetchEvents=async()=>{
        setIsLoading(true);
        try{
            const res= await axios.get("api/events/search",{
                params:{
                    searchText: '',
                    page:0,
                    size:10
                }
            });

            const res2= await axios.get("api/bookings/searchAll-bookings",{
                params:{
                    searchText: '',
                    page:0,
                    size:10
                },
                withCredentials:true
            })
            //console.log('Fetched Events:', res.data.data.dataList);
           // console.log('booking count:', res2.data.data);
            const eventList = Array.isArray(res.data.data.dataList) ? res.data.data.dataList : [];
            setEvents(eventList);


            const bookings=res2.data.data.dataList;
            const counts = {};
            eventList.forEach(event => {
                const eventId = event?.eventId || event?.id;
                counts[eventId] = bookings.filter(
                    booking => booking.sessionId?.eventId?.eventId === eventId
                ).length;
            });
            setBookingCounts(counts);

        }
        catch(error) {
            console.error('Error fetching events:', error);
            setEvents([]); // Ensure events is always an array
        }
        finally {
            setIsLoading(false);
        }
    }

    const handleClick=(eventId)=>{
            navigate(`/booking-approval/${eventId}`);
            console.log(eventId);
    }


    return (
        <>
            <div className="min-h-screen bg-[#7895B2]">

                {isLoading ? (
                    <div className="flex items-center justify-center py-16">
                        <svg className="w-12 h-12 text-gray-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                    </div>
                ) : events.length === 0 ? (
                        <div className="text-center text-gray-700 py-8">No events found.</div>
                    ):(events.map((event, index) => {
                const targetEventId = event?.eventId || event?.id;
                const count = bookingCounts[targetEventId] ?? 0;
                console.log(count);
                return(
                <div key={event?.id ?? index} className=" bg-[#7895B2] px-4 py-8 font-sora">

                    <div className=" mx-auto bg-[#D9D9D9]  rounded-2xl shadow-lg  w-full ">
                        <div className="flex w-full items-center p-6 mb-6">
                            <div className="w-[50%]">
                                <h1 className="text-gray-500 font-bold font-sora text-[64px] ">{event?.name || event?.title || event?.eventName || 'Event name'}</h1>
                            </div>
                            <div className="w-[50%] flex justify-center h-48 ">
                                <div
                                    className="flex flex-col p-8 items-center px-4  h-full w-64 rounded-lg shadow-lg bg-[#2A8ACE]">
                                    <h2 className=" text-white font-semibold text-2xl font-sora mb-1 ">Total Bookings</h2>
                                    <h2 className="text-white font-semibold text-[64px] font-sora  ">{count}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-center pb-6">
                            <button className="bg-[#2A8ACE] py-3 px-10 text-white rounded-md hover:bg-blue-600"
                                    onClick={() => handleClick(event.eventId || event.id)}>Booking
                            </button>
                        </div>

                    </div>
                </div>
                );
            }))}
            </div>
        </>
    );
}
export default Bookings;
