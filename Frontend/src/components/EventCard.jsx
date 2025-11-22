import React from "react";

import EventImage from "../assets/event/Rectangle 4.png";

const EventCard = ({ title, subtitle }) => {
  return (
    <div className="relative w-full h-48 rounded-xl overflow-hidden mt-10">
      <img
        src={EventImage}
        alt="Event"
        className="object-cover w-full h-full"
      />
      <div className="absolute top-4 left-4 bg-[#2A8ACE]/80 text-black w-[60%] md:w-[30%] h-[85%] rounded-xl font-sora flex flex-col justify-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold leading-tight">{title}</h2>
        <p className="text-xl md:text-xl font-semibold">{subtitle}</p>
      </div>
    </div>
  );
};

export default EventCard;

