import TableEventBookings from "../components/TableEventBookings.jsx";
import {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


function BookingDetails(){

    const { eventId } = useParams();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!eventId) {
                setBookings([]);
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const res = await axios.get(`/api/bookings/searchAllByEvent/${eventId}`,{
                    params:{
                        searchText: '',
                        page:0,
                        size:100
                    },
                    withCredentials:true
                });
                // backend returns StandardResponse: res.data.data => Page or object
                // Normalize backend response to an array

                const payload = res?.data?.data;
                console.log("bookings for event",payload.dataList);
                const bookingsArray = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.dataList)
                        ? payload.dataList
                        : Array.isArray(payload?.content)
                            ? payload.content
                            : [];


                setBookings(bookingsArray);


                           } catch (err) {
                console.error(err);
                setBookings([]);
            } finally {
               setLoading(false);
            }
        };
        fetchBookings();
    }, [eventId]);
            console.log(bookings);

    return (
        <>

           <div className="min-h-screen bg-[#7895B2] px-4 py-8 font-sora">
                <div className="bg-[#B3B3B3] rounded-lg shadow-lg p-6 px-8 mx-8 max-w-full flex-row items-center mb-8">
                    <div className="flex w-full justify-center my-4">
                        <h1 className="text-white text-3xl font bold">Event Bookings</h1>
                    </div>

                    {loading ? (
                        <div className="text-center text-white py-6">Loading bookings...</div>
                    )
                        : (
                        <TableEventBookings bookings={bookings} />
                    )}
                </div>

           </div>
        </>
    );
}
export default BookingDetails;