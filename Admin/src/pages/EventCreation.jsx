import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import callogo from "../assets/Calendar.png";
import {useLocation}  from "react-router-dom";

const EventCreation = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();




    const handleCancel = () => {
        setSelectedDate(null);
    };

    // Warn on refresh/close when a date is selected
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = ""; // Show default browser warning
        };

        if (selectedDate) {
            window.addEventListener("beforeunload", handleBeforeUnload);
        } else {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        }

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [selectedDate]);

    const handleCreate = (e) => {
    e.preventDefault();

    if (selectedDate) {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;

        console.log("date", formattedDate);

        navigate("/session-creation", {
            state: {
                selectedDate: formattedDate,
                eventName: location.state.eventName
            }
        });
    }
};

    return (
        <div className="py-10 mx-auto bg-[#788DA2] font-sora">

            <div className="text-white ml-8 mb-10 text-[40px] font-semibold font-sora">
                <h1> Time slots</h1>
            </div>


            <div className="py-10 mx-auto jusrtify-center bg-[#B3B3B3] w-[90%] rounded-xl min-h-[300px] ">
                <div className="text-white text-center  text-[40px] text-bold font-sora">
                    <h1> Event 1 </h1>
                </div>

                <div className="bg-[#D9D9D9] justify-center mx-auto w-1/4 mt-5 flex flex-col items-center p-4 rounded-xl min-w-[250px]">
                    <h1 className="py-5 text-[30px] font-semibold">Date</h1>
                    <img src={callogo} alt="Logo" className="h-10 sm:h-12 mb-5" />
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select a date"
                        className="border border-gray-400 p-2 rounded"
                    />
                    {selectedDate && (
                        <>
                            <p className="mt-4 text-sm text-gray-700">
                                Selected Date: {selectedDate.toDateString()}
                            </p>
                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="bg-[#2A8ACE] text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Create
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
};

export default EventCreation;
