import React, {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate}   from "react-router-dom";

function ProgressEvents(){

    const [events,setEvents]=useState([]);
    const[isLoading,setIsLoading]=useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents=async ()=>{
        setIsLoading(true);
        try{
            const res = await axios.get("api/events/search",{
                params: {
                    searchText: '',
                    page: 0,
                    size: 10
                }
            });

            console.log("Fetched events:", res.data.data.dataList);
            const eventList = Array.isArray(res.data.data.dataList) ? res.data.data.dataList : [];

            setEvents(eventList);
            setIsLoading(false);
        }
        catch(e){console.log(e);}
    }

 return (
     <>
         <div className="relative min-h-screen bg-[#7895B2] px-4 py-20  font-sora">
                <h1 className="text-gray-100 text-center font-bold text-3xl mb-12  ">Select Event to check the Booking Progress</h1>

             {isLoading ? (
                 <div className="flex items-center justify-center py-16">
                     <svg className="w-12 h-12 text-gray-300 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                     </svg>
                 </div>
             ) : (
                 <div className="mx-auto  grid grid-cols-3 gap-6 items-center">
                     {events.map((event,index) => (
                         <div key={event.id || index} className="flex-col items-center   bg-[#D9D9D9] rounded-2xl p-6 shadow-lg hover:cursor-pointer hover:scale-102 transition-transform "
                         onClick={()=>navigate(`/progress/${event.eventId}`)}>
                             <h2 className="text-4xl font-bold text-[#2A8ACE] mb-3">{event.eventName}</h2>
                             <h3 className="text-xl font-bold text-[#2A8ACE]">{event.date}</h3>
                         </div>
                     ))}
                 </div>
             )}
         </div>
     </>
 );
}
export default ProgressEvents;