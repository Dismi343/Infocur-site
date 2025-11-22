import React from 'react';
import event1 from '../assets/event/Event 1.png';
import event2 from '../assets/event/Event 2.png';

const events = [
  {
    id: 1,
    title: 'BATCH PHOTO',
    image: event1,
    description: 'Capture your best batch moments!',
  },
  {
    id: 2,
    title: 'INFOLEX',
    image: event2,
    description: 'Wordplay meets tech — join the fun!',
  },
];

const UpcomingEvents = () => {
  return (
    <div className="bg-[#D9D9D9] p-6 sm:p-8 rounded-3xl flex flex-col lg:flex-row items-start gap-8">
      {/* Left title section */}
      <div className="w-full lg:max-w-[35%] px-2 sm:px-6 font-sora text-center lg:text-left">
        <h2 className="text-[28px] sm:text-[40px] lg:text-[56px] text-[#2682C1] font-bold leading-tight">
          UPCOMING <br className="hidden sm:block" /> EVENTS
        </h2>
        <p className="mt-3 sm:mt-4 text-[15px] sm:text-[18px] lg:text-[20px] text-black leading-snug">
          Don’t miss our next big clicks – here’s what’s coming up!
        </p>
      </div>

      {/* Right scroll section */}
      <div className="w-full flex gap-5 overflow-x-auto lg:overflow-x-auto scrollbar-hide pb-3 px-1 sm:px-0">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative flex-shrink-0 w-[240px] sm:w-[320px] md:w-[380px] lg:w-[420px] rounded-3xl shadow-md overflow-hidden bg-white"
            
          >
            {/* Image */}
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[280px] object-cover rounded-3xl"
            />

            {/* Vertical label bar */}
            <div className="absolute top-0 left-0 h-full w-[55px] sm:w-[65px] bg-[#788DA2]/90 rounded-tr-2xl rounded-br-2xl flex items-center justify-center">
              <span className="text-black font-bold text-[20px] sm:text-[13px] md:text-[25px] tracking-wide [writing-mode:vertical-rl] rotate-180">
                {event.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
